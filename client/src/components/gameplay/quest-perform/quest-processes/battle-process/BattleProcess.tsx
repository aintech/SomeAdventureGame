import { Component, MouseEvent } from 'react';
import { isAlive } from '../../../../../models/hero/Hero';
import QuestCheckpoint from '../../../../../models/QuestCheckpoint';
import { replace } from '../../../../../utils/arrays';
import Loader from '../../../../loader/Loader';
import HeroesPanel from '../../heroes-panel/HeroesPanel';
import MonsterItem from '../../monster-item/MonsterItem';
import CheckpointActor, { convertToActor } from '../../quest-processes/process-helpers/CheckpointActor';
import QuestHero, { BattleAction } from '../process-helpers/QuestHero';
import { QuestProcessState } from '../QuestProcess';
import './battle-process.scss';

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
  heroes: QuestHero[];
  updateHeroesState: (heroes: QuestHero[]) => void;
  moveOnwards: (
    won: boolean,
    collectedDrops: Map<number, number[]>, // actorId to monster health amount refered to drop
    battleEvents: Map<number, HeroEvent[]>
  ) => void;
};

export type HeroEvent = {
  time: number;
  itemId?: number;
  hpAlter?: number;
};

type BattleProcessState = QuestProcessState & {
  actorsQueue: (QuestHero | CheckpointActor)[];
  currentActorIdx: number;
  currentActor?: QuestHero | CheckpointActor;
  processState: ProcessState;
  monsters: CheckpointActor[];
  battleEvents: Map<number, HeroEvent[]>; // heroId to events
};

class BattleProcess extends Component<BattleProcessProps, BattleProcessState> {
  constructor(props: BattleProcessProps) {
    super(props);
    this.state = {
      seconds: 0,

      actorsQueue: [],
      currentActorIdx: -1,

      eventMessages: [],
      processState: ProcessState.LOADING,
      monsters: [],
      drops: [],
      battleEvents: new Map(),
    };

    this.processRound = this.processRound.bind(this);
  }

  componentDidMount() {
    const { checkpoint } = this.props;

    const monsters = [...checkpoint.enemies!.map((e) => convertToActor(e))];

    this.setState(
      {
        actorsQueue: [...this.props.heroes, ...monsters],
        monsters,
        processState: ProcessState.SWITCH_ACTOR,
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
      case ProcessState.PLAYER_PERFORM:
        //do nothing
        break;

      case ProcessState.SWITCH_ACTOR:
        let monsters = this.state.monsters;
        monsters.filter((m) => m.currentHealth > 0).forEach((m) => (m.hitted = undefined));
        this.props.heroes.filter((h) => isAlive(h)).forEach((h) => (h.hitted = undefined));

        let queueIdx = this.state.currentActorIdx + 1;
        if (queueIdx === this.state.actorsQueue.length) {
          queueIdx = 0;
        }

        const currentActor = this.state.actorsQueue[queueIdx];
        const processState = currentActor.isHero ? ProcessState.PLAYER_PERFORM : ProcessState.MONSTER_PERFORM;

        this.setState(
          {
            currentActor,
            processState,
            currentActorIdx: queueIdx,
            monsters,
          },
          () => this.processRound()
        );
        break;

      case ProcessState.MONSTER_PERFORM:
        const monster = this.state.currentActor as CheckpointActor;
        const heroes = this.props.heroes.filter((h) => isAlive(h));
        const victim = heroes[Math.floor(Math.random() * heroes.length)];
        const damage = Math.max(1, monster.stats.power - victim.stats.defence - victim.equipStats.defence);
        victim.health -= damage;
        victim.hitted = true;

        //CONTINUE: заставить иконку героя обновлять healthbar и играть удар сразу по получению
        const updatedHeroes = replace(this.props.heroes, victim);
        this.props.updateHeroesState(updatedHeroes);

        this.setState(
          {
            processState: ProcessState.SWITCH_ACTOR,
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
    const { currentActor } = this.state;
    if (currentActor && currentActor.isHero) {
      const hero = currentActor as QuestHero;
      if (hero.action === BattleAction.ATTACK) {
        const damage = Math.max(1, hero.stats.power + hero.equipStats.power - monster.stats.defence);
        monster.currentHealth -= damage;
        monster.hitted = true;
        this.setState(
          (state) => {
            return {
              processState: ProcessState.SWITCH_ACTOR,
              monsters: replace(state.monsters, monster, 'actorId'),
            };
          },
          () => setTimeout(this.processRound, 500)
        );
      }
    }
  };

  checkBattleComplete() {
    const won = this.state.monsters.every((m) => m.currentHealth <= 0);
    const lost = this.props.heroes.every((h) => h.health <= 0);
    if (won || lost) {
      this.setState({
        processState: won ? ProcessState.BATTLE_WON : ProcessState.BATTLE_LOST,
      });

      if (won) {
        // this.props.setHeroRewards(this.calcHeroRewards(true));
      }

      return true;
    }
    return false;
  }

  completeCheckpointClickHandler(e: MouseEvent) {
    this.props.moveOnwards(this.state.processState === ProcessState.BATTLE_WON, new Map(), this.state.battleEvents);
  }

  render() {
    const { monsters, currentActor, processState } = this.state;
    const { heroes } = this.props;

    const grid = `repeat(${monsters.length}, ${100 / monsters.length}%)`;

    return (
      <div className="battle-process">
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        {processState === ProcessState.BATTLE_WON ? (
          <button className="quest-process__btn_onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            На карту локации
          </button>
        ) : processState === ProcessState.BATTLE_LOST ? (
          <button className="quest-process__btn_onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            Отступить
          </button>
        ) : null}
        <div className="battle-process__monsters-holder" style={{ gridTemplateColumns: grid }}>
          {monsters.map((m, idx) => (
            <MonsterItem key={m.actorId} monster={m} idx={idx} handleClickMonster={this.handleClickMonster} />
          ))}
        </div>

        <HeroesPanel actors={heroes} current={currentActor?.isHero ? (currentActor as QuestHero) : undefined} showActions={true} />
      </div>
    );
  }
}

export default BattleProcess;
