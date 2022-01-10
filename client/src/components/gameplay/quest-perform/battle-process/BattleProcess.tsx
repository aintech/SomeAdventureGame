import { Component } from 'react';
import { connect } from 'react-redux';
import { isAlive } from '../../../../models/hero/Hero';
import QuestCheckpoint, { CheckpointReward } from '../../../../models/QuestCheckpoint';
import { CheckpointPassedBody } from '../../../../services/QuestService';
import { replace } from '../../../../utils/arrays';
import Loader from '../../../loader/Loader';
import HeroesPanel from '../heroes-panel/HeroesPanel';
import MonsterItem from '../monster-item/MonsterItem';
import './battle-process.scss';
import CheckpointActor, { convertToActor, StatusEffectType } from './process-helpers/CheckpointActor';
import QuestHero, { HeroAction } from './process-helpers/QuestHero';

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

export type HeroEvent = {
  time: number;
  itemId?: number;
  hpAlter?: number;
};

type BattleProcessState = {
  actorsQueue: (QuestHero | CheckpointActor)[];
  currentActorIdx: number;
  currentActor?: QuestHero | CheckpointActor;

  processState: ProcessState;
  heroes: QuestHero[];
  monsters: CheckpointActor[];
  battleEvents: Map<number, HeroEvent[]>; // heroId to events, урон, лечение и использование предметов героем
};

class BattleProcess extends Component<BattleProcessProps, BattleProcessState> {
  private hittedMemo: number[] = [];

  constructor(props: BattleProcessProps) {
    super(props);
    this.state = {
      actorsQueue: [],
      currentActorIdx: -1,

      processState: ProcessState.LOADING,
      heroes: [],
      monsters: [],
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
      case ProcessState.BATTLE_WON:
      case ProcessState.BATTLE_LOST:
        //do nothing
        break;

      case ProcessState.CHECKING_STATUS_EFFECTS:
        this.checkStatusEffects();
        break;

      case ProcessState.SWITCH_ACTOR:
        this.switchActor();
        break;

      case ProcessState.PLAYER_PERFORM:
        //do nothing
        break;

      case ProcessState.MONSTER_PERFORM:
        this.monsterPerform();
        break;

      default:
        throw new Error(`Process ${ProcessState[this.state.processState]} is not implemented yet!`);
    }
  }

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
      if (hero.action === HeroAction.ATTACK) {
        const damage = Math.max(1, hero.stats.power + hero.equipStats.power - monster.stats.defence);
        monster.health -= damage;
        monster.hitted = true;

        this.setState(
          (state) => {
            return {
              processState: ProcessState.SWITCH_ACTOR,
              monsters: replace(state.monsters, monster),
            };
          },
          () => setTimeout(this.processRound, 500)
        );
      }
    }
  };

  performHeroAction = (action: HeroAction) => {
    const hero = this.state.currentActor as QuestHero;
    if (hero) {
      switch (action) {
        case HeroAction.DEFENCE:
          hero.statusEffects.push({ type: StatusEffectType.DEFENDED, amount: 0.5, duration: 1 });
          break;
        default:
          throw new Error(`Unknown hero action type ${HeroAction[action]}`);
      }

      this.setState(
        (state) => {
          return {
            ...state,
            currentActor: hero,
            heroes: replace(state.heroes, hero),
            actorsQueue: replace(state.actorsQueue, hero),
            processState: ProcessState.SWITCH_ACTOR,
          };
        },
        () => this.processRound()
      );
    }
  };

  checkStatusEffects = () => {
    const { currentActor } = this.state;
    if (currentActor) {
      let statusPlaytime = 0;

      this.setState(
        {
          processState: currentActor.isHero ? ProcessState.PLAYER_PERFORM : ProcessState.MONSTER_PERFORM,
        },
        () => setTimeout(this.processRound, statusPlaytime)
      );
    }
  };

  switchActor = () => {
    let { heroes, monsters } = this.state;

    monsters.filter((m) => m.health > 0).forEach((m) => (m.hitted = undefined));
    heroes.filter((h) => isAlive(h)).forEach((h) => (h.hitted = undefined));

    let queueIdx = this.state.currentActorIdx;
    while (true) {
      queueIdx++;
      if (queueIdx === this.state.actorsQueue.length) {
        queueIdx = 0;
      }
      if (this.state.actorsQueue[queueIdx].health > 0) {
        break;
      }
    }

    const currentActor = this.state.actorsQueue[queueIdx];
    const processState = ProcessState.CHECKING_STATUS_EFFECTS;

    this.setState(
      {
        currentActor,
        processState,
        currentActorIdx: queueIdx,
        heroes,
        monsters,
      },
      () => this.processRound()
    );
  };

  monsterPerform = () => {
    let { heroes } = this.state;

    const monster = this.state.currentActor as CheckpointActor;
    const aliveHeroes = heroes.filter((h) => isAlive(h));
    const victim = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
    const damage = Math.max(1, monster.stats.power - victim.stats.defence - victim.equipStats.defence);
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

    this.setState(
      {
        processState: ProcessState.SWITCH_ACTOR,
        heroes: updatedHeroes,
        battleEvents,
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
    const { monsters, heroes, currentActor, processState } = this.state;

    const { checkpoint, checkpointReward } = this.props;

    const grid = `repeat(${monsters.length}, ${100 / monsters.length}%)`;

    const battleEnded = processState === ProcessState.BATTLE_WON || processState === ProcessState.BATTLE_LOST;

    return (
      <div className="battle-process">
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        {battleEnded ? (
          <div className="battle-process__complete">
            <p className="battle-process__message">Победа</p>

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
              <MonsterItem key={m.id} monster={m} idx={idx} handleClickMonster={this.handleClickMonster} />
            ))}
          </div>
        )}

        <HeroesPanel
          actors={heroes}
          current={currentActor?.isHero ? (currentActor as QuestHero) : undefined}
          showActions={!battleEnded}
          heroRewards={checkpointReward?.checkpointId === checkpoint.id ? checkpointReward : undefined}
          performHeroAction={this.performHeroAction}
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
