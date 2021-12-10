import { Component, MouseEvent } from 'react';
import Hero, { maxHealth } from '../../../../../models/hero/Hero';
import QuestCheckpoint from '../../../../../models/QuestCheckpoint';
import Loader from '../../../../loader/Loader';
import HeroesPanel from '../../heroes-panel/HeroesPanel';
import CheckpointActor, { convertToActor } from '../../quest-processes/process-helpers/CheckpointActor';
import { rgba } from '../../quest-processes/process-helpers/Color';
import { Direction, Effect, EventMessage } from '../../quest-processes/process-helpers/EventMessage';
import { HeroReactionType } from '../../QuestPerform';
import { QuestProcessState } from '../QuestProcess';
import './battle-process.scss';

const initialReactions = () => {
  const initials: Map<HeroReactionType, number[]> = new Map();
  initials.set(HeroReactionType.HITTED, []);
  initials.set(HeroReactionType.HEALED, []);
  return initials;
};

enum ProcessState {
  LOADING,
  SWITCH_ACTOR,
  PLAYER_MOVE,
  ENEMY_MOVE,
  BATTLE_WON,
  BATTLE_LOST,
}

type BattleProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  updateHeroesState: (heroes: Hero[]) => void;
  moveOnwards: (
    won: boolean,
    collectedDrops: Map<number, number[]>, // actorId to enemy health amount refered to drop
    battleEvents: Map<number, HeroEvent[]>
  ) => void;
};

export type HeroEvent = {
  time: number;
  itemId?: number;
  hpAlter?: number;
};

type BattleProcessState = QuestProcessState & {
  actorsQueue: (Hero | CheckpointActor)[];
  currentActorIdx: number;
  currentHero?: Hero;

  reacted: Map<HeroReactionType, number[]>;

  // Т.к. герой может реагировать каждый раунд пришлось придумать такую переключалку
  // иначе анимация не поймёт что ей надо переиграть, т.к. класс в HeroItem уже будет выставлен в анимацию
  heroHittedMemo: number[];
  heroHealedMemo: number[];

  processState: ProcessState;
  enemies: CheckpointActor[];
  battleEvents: Map<number, HeroEvent[]>; // heroId to events
};

class BattleProcess extends Component<BattleProcessProps, BattleProcessState> {
  constructor(props: BattleProcessProps) {
    super(props);
    this.state = {
      seconds: 0,

      actorsQueue: [],
      currentActorIdx: 0,

      reacted: new Map(),
      heroHittedMemo: [],
      heroHealedMemo: [],

      eventMessages: [],
      processState: ProcessState.LOADING,
      enemies: [],
      drops: [],
      battleEvents: new Map(),
    };
  }

  componentDidMount() {
    const { checkpoint } = this.props;

    const enemies = [...checkpoint.enemies!.map((e) => convertToActor(e))];

    this.setState(
      {
        actorsQueue: [...this.props.heroes, ...enemies],
        reacted: initialReactions(),
        enemies,
        processState: ProcessState.SWITCH_ACTOR,
        beginTime: new Date(),
        eventMessages: [new EventMessage(2, { x: 0, y: 0 }, 72, 'BEGIN', rgba(255, 255), Direction.CENTER, Effect.FADE_IN_OUT)],
      },
      () => this.processRound()
    );
  }

  componentWillUnmount() {
    this.state.enemies.forEach((e) => {
      e.drop.forEach((d) => (d.dropped = undefined));
    });
  }

  processRound() {
    switch (this.state.processState) {
      case ProcessState.LOADING:
      case ProcessState.BATTLE_WON:
      case ProcessState.BATTLE_LOST:
        //do nothing
        break;
      case ProcessState.SWITCH_ACTOR:
        const actor = this.state.actorsQueue[this.state.currentActorIdx];
        if (actor.isHero) {
          this.setState({
            currentHero: actor as Hero,
            processState: ProcessState.PLAYER_MOVE,
          });
        } else {
        }

        break;
      default:
        throw new Error(`Process ${ProcessState[this.state.processState]} is not implemented yet!`);
    }
    this.checkBattleComplete();
  }

  handlePlayerClickEnemy = (enemy: CheckpointActor) => {
    console.log(enemy.name);
  };

  heroesReactions = (reactions: Map<number, Map<HeroReactionType, number>>) => {
    const actors = [...this.props.heroes];
    const toReacted = initialReactions();

    reactions.forEach((reaction, heroId) => {
      const hero = actors.find((h) => h.id === heroId)!;

      let healthAdjust = 0;

      reaction.forEach((amount, type) => {
        if (!toReacted.get(type)!.includes(heroId)) {
          toReacted.get(type)!.push(heroId);
        }
        healthAdjust += amount;
      });

      hero.health += healthAdjust;
      if (hero.health < 0) {
        hero.health = 0;
      }
      if (hero.health > maxHealth(hero)) {
        hero.health = maxHealth(hero);
      }
    });

    if (reactions.size > 0) {
      const toHitted = [...this.state.heroHittedMemo];
      const toHealed = [...this.state.heroHealedMemo];

      toReacted.get(HeroReactionType.HITTED)!.forEach((heroId) => {
        if (toHitted.includes(heroId)) {
          const idx = toHitted.indexOf(heroId);
          toHitted.splice(idx, 1);
        } else {
          toHitted.push(heroId);
        }
      });

      toReacted.get(HeroReactionType.HEALED)!.forEach((heroId) => {
        if (toHealed.includes(heroId)) {
          const idx = toHealed.indexOf(heroId);
          toHealed.splice(idx, 1);
        } else {
          toHealed.push(heroId);
        }
      });

      // setHeroActors(actors);
      this.props.updateHeroesState(actors);
      this.setState({
        reacted: toReacted,
        heroHittedMemo: toHitted,
        heroHealedMemo: toHealed,
      });
    }
  };

  checkBattleComplete() {
    const won = this.state.enemies.every((e) => e.currentHealth <= 0);
    const lost = this.props.heroes.every((h) => h.health <= 0);
    if (won || lost) {
      const { drops } = this.state;
      drops.forEach((d) => {
        if (!d.timeouted && !d.collected) {
          d.collected = true;
        }
      });

      this.setState({
        drops,
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
    this.props.moveOnwards(this.state.processState === ProcessState.BATTLE_WON, this.collectCheckpointDrops(), this.state.battleEvents);
  }

  collectCheckpointDrops() {
    const collected: Map<number, number[]> = new Map();
    if (this.state.processState === ProcessState.BATTLE_LOST) {
      return collected;
    }

    this.state.drops
      .filter((drop) => drop.collected)
      .forEach((drop) => {
        if (collected.has(drop.actorId!)) {
          collected.get(drop.actorId!)!.push(drop.appearAt!);
        } else {
          collected.set(drop.actorId!, [drop.appearAt!]);
        }
      });

    return collected;
  }

  render() {
    const { enemies, currentHero, processState, reacted, heroHittedMemo, heroHealedMemo } = this.state;
    const { heroes } = this.props;

    const grid = `repeat(${enemies.length}, ${100 / enemies.length}%)`;

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
        <div className="battle-process__opponents-holder" style={{ gridTemplateColumns: grid }}>
          {enemies.map((e, idx) => (
            <div key={e.actorId} className="battle-process__opponent-holder">
              <div
                className="battle-process__opponent"
                style={{ zIndex: idx % 2, marginTop: `${(idx % 2) * 40}px`, gridColumn: idx + 1 }}
                onClick={() => this.handlePlayerClickEnemy(e)}
              >
                {e.name}
                <div className={`battle-process__opponent_${e.name}`} style={{ zIndex: idx % 2 }}></div>
              </div>
            </div>
          ))}
        </div>

        <HeroesPanel
          actors={heroes}
          current={currentHero}
          showActions={true}
          reacted={reacted}
          heroHittedMemo={heroHittedMemo}
          heroHealedMemo={heroHealedMemo}
        />
      </div>
    );
  }
}

export default BattleProcess;
