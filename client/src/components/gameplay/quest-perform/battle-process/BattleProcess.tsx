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
import CheckpointActor, { convertToActor } from './process-helpers/CheckpointActor';
import QuestHero, { BattleAction } from './process-helpers/QuestHero';

enum ProcessState {
  LOADING,
  SWITCH_ACTOR,
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

    let { heroes, monsters, processState } = this.state;

    switch (processState) {
      case ProcessState.LOADING:
      case ProcessState.BATTLE_WON:
      case ProcessState.BATTLE_LOST:
      case ProcessState.PLAYER_PERFORM:
        //do nothing
        break;

      case ProcessState.SWITCH_ACTOR:
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
        const processState = currentActor.isHero ? ProcessState.PLAYER_PERFORM : ProcessState.MONSTER_PERFORM;

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
        break;

      case ProcessState.MONSTER_PERFORM:
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
      if (hero.action === BattleAction.ATTACK) {
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

    // continue - показывать награду и опыт при чекпоинте

    // trophy - добыча
    return (
      <div className="battle-process">
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        {battleEnded ? (
          <div className="battle-process__complete">
            <p className="battle-process__message">Победа</p>

            <div className="battle-process__reward">
              {checkpointReward?.checkpointId === checkpoint.id ? (
                <>
                  <p className="battle-process__reward-exp">
                    Опыт {checkpointReward.rewards.reduce((exp, rwd) => exp + rwd.experience, 0)}
                  </p>
                  <p className="battle-process__reward-swag">
                    Добыто {checkpointReward.rewards.reduce((gld, rwd) => gld + rwd.gold, 0)} монет
                  </p>
                </>
              ) : (
                <Loader message="Checking rewards" />
              )}
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

        <HeroesPanel actors={heroes} current={currentActor?.isHero ? (currentActor as QuestHero) : undefined} showActions={!battleEnded} />
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
