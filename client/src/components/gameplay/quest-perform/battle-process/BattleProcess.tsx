import { Component } from 'react';
import { connect } from 'react-redux';
import { isAlive, maxHealth } from '../../../../models/hero/Hero';
import { HeroItem, ItemSubtype } from '../../../../models/Item';
import QuestCheckpoint, { CheckpointReward } from '../../../../models/QuestCheckpoint';
import { CheckpointPassedBody } from '../../../../services/QuestService';
import { remove, replace } from '../../../../utils/arrays';
import Loader from '../../../loader/Loader';
import HeroesPanel from '../heroes-panel/HeroesPanel';
import MonsterItem from '../monster-item/MonsterItem';
import { BattleAction, BattleActionType, isActive } from '../process-models/BattleAction';
import { BattleMessage, dmgMessage } from '../process-models/BattleMessage';
import CheckpointActor, { convertToActor } from '../process-models/CheckpointActor';
import { HeroEvent } from '../process-models/HeroEvent';
import QuestHero from '../process-models/QuestHero';
import { StatusEffect, StatusEffectType } from '../process-models/StatusEffect';
import './battle-process.scss';

enum ProcessState {
  LOADING,
  SWITCH_ACTOR,
  CHECKING_STATUS_EFFECTS,
  PLAYER_PERFORM,
  MONSTER_PERFORM,
  BATTLE_WON,
  BATTLE_LOST,
}

type BattleProcessProps = {
  checkpoint: QuestCheckpoint;
  propHeroes: QuestHero[];
  checkpointReward?: CheckpointReward;
  updateHeroesState: (heroes: QuestHero[]) => void;
  checkpointPassed: (result: CheckpointPassedBody) => void;
  closeProcess: () => void;
};

type BattleProcessState = {
  round: number;
  actorsQueue: (QuestHero | CheckpointActor)[];
  currentActorIdx: number;
  currentActor?: QuestHero | CheckpointActor;

  processState: ProcessState;
  heroes: QuestHero[];
  monsters: CheckpointActor[];
  messages: BattleMessage[];
  battleEvents: Map<number, HeroEvent[]>; // heroId to events, урон, лечение и использование предметов героем
};

class BattleProcess extends Component<BattleProcessProps, BattleProcessState> {
  private hittedMemo: number[] = [];

  constructor(props: BattleProcessProps) {
    super(props);
    this.state = {
      round: 0,
      actorsQueue: [],
      currentActorIdx: -1,

      processState: ProcessState.LOADING,
      heroes: [],
      monsters: [],
      messages: [],
      battleEvents: new Map(),
    };

    this.processRound = this.processRound.bind(this);
  }

  componentDidMount() {
    const { checkpoint } = this.props;

    const monsters = [...checkpoint.enemies!.map((e) => convertToActor(e))];

    const battleEvents: Map<number, HeroEvent[]> = new Map();

    this.props.propHeroes.forEach((h) => battleEvents.set(h.id, []));

    this.setState(
      {
        actorsQueue: [...this.props.propHeroes, ...monsters],
        // закидываем героев из пропсов в стейт чтобы апдейтился рендер при изменении героев
        heroes: this.props.propHeroes,
        monsters,
        processState: ProcessState.SWITCH_ACTOR,
        battleEvents,
      },
      () => this.processRound()
    );
  }

  processRound() {
    if (this.checkBattleComplete()) {
      return;
    }

    switch (this.state.processState) {
      case ProcessState.LOADING:
        //do nothing
        break;

      case ProcessState.SWITCH_ACTOR:
        this.switchActor();
        break;

      case ProcessState.CHECKING_STATUS_EFFECTS:
        this.checkStatusEffects();
        break;

      case ProcessState.PLAYER_PERFORM:
        //do nothing
        break;

      case ProcessState.MONSTER_PERFORM:
        this.monsterPerform();
        break;

      case ProcessState.BATTLE_WON:
      case ProcessState.BATTLE_LOST:
        //do nothing
        break;

      default:
        throw new Error(`Process ${ProcessState[this.state.processState]} is not implemented yet!`);
    }
  }

  switchActor = () => {
    let { heroes, monsters } = this.state;
    let round = this.state.round;

    monsters.filter((m) => m.health > 0).forEach((m) => (m.hitted = undefined));
    heroes
      .filter((h) => isAlive(h))
      .forEach((h) => {
        h.hitted = undefined;
        h.healed = undefined;
        h.action = { type: BattleActionType.ATTACK };
      });

    let queueIdx = this.state.currentActorIdx;
    while (true) {
      queueIdx++;
      if (queueIdx === this.state.actorsQueue.length) {
        queueIdx = 0;
        round++;
      }
      if (this.state.actorsQueue[queueIdx].health > 0) {
        break;
      }
    }

    const currentActor = this.state.actorsQueue[queueIdx];
    const processState = ProcessState.CHECKING_STATUS_EFFECTS;

    this.setState(
      {
        round,
        currentActor,
        processState,
        currentActorIdx: queueIdx,
        heroes,
        monsters,
      },
      () => this.processRound()
    );
  };

  checkStatusEffects = () => {
    const actor = this.state.currentActor;
    if (actor) {
      let statusPlaytime = 0;
      let effects = actor.statusEffects;
      let statusEffect: StatusEffect | undefined = undefined;

      // Берем первый эффект который ещё не действовал в текущем раунде.
      for (let i = 0; i < effects.length; i++) {
        const effect = effects[i];
        // Пропускаем если в текущем раунде эффект уже отыгран.
        if (effect.round === this.state.round) {
          continue;
        }

        statusEffect = effects[i];
      }

      if (statusEffect) {
        statusEffect.duration--;
        statusEffect.round = this.state.round;

        statusPlaytime = statusEffect.type === StatusEffectType.DEFENDED ? 0 : 500;

        this.playEffect(statusEffect);

        if (statusEffect.duration === 0) {
          const idx = effects.findIndex((s) => s.id === statusEffect!.id);
          effects = [...actor.statusEffects.slice(0, idx), ...actor.statusEffects.slice(idx + 1)];
          actor.statusEffects = effects;
        }

        let heroes = actor.isHero ? replace(this.state.heroes, actor) : this.state.heroes;
        let monsters = !actor.isHero ? replace(this.state.monsters, actor) : this.state.monsters;
        let actorsQueue = replace(this.state.actorsQueue, actor);

        this.setState(
          {
            currentActor: actor,
            heroes,
            monsters,
            actorsQueue,
          },
          // Эффект запустилии после того как он отыграет перейдём к следующему эффекту.
          () => setTimeout(() => this.processRound(), statusPlaytime)
        );
      } else {
        // Если эфффектов больше не осталось, продолжаем раунд.
        this.setState(
          {
            processState: actor.isHero ? ProcessState.PLAYER_PERFORM : ProcessState.MONSTER_PERFORM,
          },
          () => this.processRound()
        );
      }
    }
  };

  // Тут мы отыгрываем эффект (всякие урон, лечение и т.д. у которых есть анимация).
  playEffect = (effect: StatusEffect) => {
    console.log(effect);
  };

  handleClickMonster = (monster: CheckpointActor) => {
    if (this.state.processState !== ProcessState.PLAYER_PERFORM) {
      return;
    }
    if (monster.health <= 0) {
      return;
    }

    const { currentActor } = this.state;
    if (currentActor && currentActor.isHero) {
      const hero = currentActor as QuestHero;

      switch (hero.action.type) {
        case BattleActionType.ATTACK:
          const damage = Math.max(1, hero.stats.power + hero.equipStats.power - monster.stats.defence);
          monster.health -= damage;
          monster.hitted = true;

          const message = dmgMessage(monster, damage);
          setTimeout(() => {
            this.setState((state) => {
              return {
                ...state,
                messages: remove(state.messages, message),
              };
            });
          }, 700);

          this.setState(
            (state) => {
              return {
                processState: ProcessState.SWITCH_ACTOR,
                monsters: replace(state.monsters, monster),
                messages: [...state.messages, message],
              };
            },
            () => setTimeout(this.processRound, 500)
          );
          break;
      }
    }
  };

  actionChanged = (action: BattleAction) => {
    const hero = this.state.currentActor as QuestHero;
    if (hero) {
      hero.action = action;
      let processState = this.state.processState;

      if (isActive(action.type)) {
        switch (action.type) {
          case BattleActionType.DEFENCE:
            hero.statusEffects.push({ id: Math.random(), type: StatusEffectType.DEFENDED, amount: 0.5, duration: 1 });
            break;

          default:
            throw new Error(`Unknown hero action type ${BattleActionType[action.type]}`);
        }

        processState = ProcessState.SWITCH_ACTOR;
      }

      this.setState(
        (state) => {
          return {
            ...state,
            currentActor: hero,
            heroes: replace(state.heroes, hero),
            actorsQueue: replace(state.actorsQueue, hero),
            processState,
          };
        },
        () => {
          if (isActive(action.type)) {
            this.processRound();
          }
        }
      );
    }
  };

  itemUsed = (initiator: QuestHero, target: QuestHero | CheckpointActor, item: HeroItem) => {
    const battleEvents = new Map(this.state.battleEvents);
    battleEvents.set(initiator.id, [...battleEvents.get(initiator.id)!, { time: new Date().getTime(), itemId: item.id }]);

    let currentActor = this.state.currentActor! as QuestHero;
    let heroes = this.state.heroes;

    item.amount--;

    switch (item.subtype) {
      case ItemSubtype.HEALTH_POTION:
        const healed = target as QuestHero;
        const healAmount = Math.min(maxHealth(healed) - healed.health, maxHealth(healed) * 0.5);
        battleEvents.set(healed.id, [...battleEvents.get(healed.id)!, { time: new Date().getTime(), hpAlter: healAmount }]);

        if (currentActor?.id !== initiator.id) {
          throw new Error(`Current actor is not initiator`);
        }

        currentActor.items = replace(currentActor.items, currentActor.items.find((i) => i.id === item.id)!);
        healed.health += healAmount;
        healed.healed = true;

        heroes = replace(heroes, currentActor);

        break;

      default:
        throw new Error(`Unknown item type ${ItemSubtype[item.subtype]}`);
    }

    this.setState(
      {
        currentActor,
        heroes,
        battleEvents,
        processState: ProcessState.SWITCH_ACTOR,
      },
      () => setTimeout(this.processRound, 500)
    );
  };

  monsterPerform = () => {
    let { heroes } = this.state;

    const monster = this.state.currentActor as CheckpointActor;
    const aliveHeroes = heroes.filter((h) => isAlive(h));
    const victim = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];

    let power = monster.stats.power;

    const defendedStatus = victim.statusEffects.find((s) => s.type === StatusEffectType.DEFENDED)?.amount ?? 1;

    let damage = Math.max(1, power * defendedStatus - victim.stats.defence - victim.equipStats.defence);
    if (damage > victim.health) {
      damage = victim.health;
    }
    victim.health -= damage;

    // хитрость чтобы один герой мог отыгрывать анимацию несколько ходов подряд,
    // какая анимация играет зависит от hitted = undefined, false или true
    if (this.hittedMemo.includes(victim.id)) {
      victim.hitted = true;
      this.hittedMemo.splice(this.hittedMemo.indexOf(victim.id), 1);
    } else {
      victim.hitted = false;
      this.hittedMemo.push(victim.id);
    }

    const updatedHeroes = replace(heroes, victim);
    const battleEvents = new Map(this.state.battleEvents);
    battleEvents.set(victim.id, [...battleEvents.get(victim.id)!, { time: new Date().getTime(), hpAlter: -damage }]);

    const message = dmgMessage(victim, damage);
    setTimeout(() => {
      this.setState((state) => {
        return {
          ...state,
          messages: remove(state.messages, message),
        };
      });
    }, 700);

    this.setState(
      (state) => {
        return {
          ...state,
          processState: ProcessState.SWITCH_ACTOR,
          heroes: updatedHeroes,
          battleEvents,
          messages: [...state.messages, message],
        };
      },
      () => setTimeout(this.processRound, 500)
    );
  };

  checkBattleComplete() {
    const won = this.state.monsters.every((m) => m.health <= 0);
    const lost = this.state.heroes.every((h) => h.health <= 0);
    if (won || lost) {
      this.setState({
        processState: won ? ProcessState.BATTLE_WON : ProcessState.BATTLE_LOST,
        currentActor: undefined,
      });

      this.props.updateHeroesState(this.state.heroes);

      if (won) {
        const events = Array.from(this.state.battleEvents, ([heroId, events]) => ({ heroId, events }));
        this.props.checkpointPassed({ id: this.props.checkpoint.id, events });
      } else {
        this.props.closeProcess();
      }

      return true;
    }

    return false;
  }

  render() {
    const { monsters, heroes, currentActor, processState, messages } = this.state;

    const { checkpoint, checkpointReward } = this.props;

    const cellSize = window.innerWidth * 0.8 > 130 * monsters.length ? '130px' : `${100 / monsters.length}%`;

    const grid = `repeat(${monsters.length}, ${cellSize})`;

    const battleEnded = processState === ProcessState.BATTLE_WON || processState === ProcessState.BATTLE_LOST;

    return (
      <div className="battle-process">
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        {battleEnded ? (
          <div className="battle-process__complete">
            <p className="battle-process__win-message">Победа</p>

            <div className="battle-process__reward">
              {checkpointReward?.checkpointId !== checkpoint.id ? <Loader message="Checking rewards" /> : null}
            </div>

            <button className="battle-process__btn-onwards" onClick={() => this.props.closeProcess()}>
              На карту локации
            </button>
          </div>
        ) : (
          <div className="battle-process__monsters-holder" style={{ gridTemplateColumns: grid }}>
            {monsters.map((m, idx) => (
              <MonsterItem
                key={m.id}
                monster={m}
                idx={idx}
                messages={messages.filter((msg) => msg.actorId === m.id)}
                handleClickMonster={this.handleClickMonster}
              />
            ))}
          </div>
        )}

        <HeroesPanel
          actors={heroes}
          current={currentActor?.isHero ? (currentActor as QuestHero) : undefined}
          showActions={!battleEnded}
          heroRewards={checkpointReward?.checkpointId === checkpoint.id ? checkpointReward : undefined}
          messages={messages}
          actionChanged={this.actionChanged}
          itemUsed={this.itemUsed}
        />
      </div>
    );
  }
}

type BattleProcessMapped = {
  checkpointReward: CheckpointReward;
};

const mapStateToProps = ({ checkpointReward }: BattleProcessMapped) => {
  return { checkpointReward };
};

export default connect(mapStateToProps)(BattleProcess);
