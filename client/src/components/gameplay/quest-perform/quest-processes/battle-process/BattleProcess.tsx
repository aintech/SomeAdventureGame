import { Component, MouseEvent } from 'react';
import { isAlive, maxHealth } from '../../../../../models/hero/Hero';
import QuestCheckpoint from '../../../../../models/QuestCheckpoint';
import Loader from '../../../../loader/Loader';
import HeroesPanel from '../../heroes-panel/HeroesPanel';
import MonsterItem from '../../monster-item/MonsterItem';
import CheckpointActor, { convertToActor } from '../../quest-processes/process-helpers/CheckpointActor';
import { rgba } from '../../quest-processes/process-helpers/Color';
import { Direction, Effect, EventMessage } from '../../quest-processes/process-helpers/EventMessage';
import { HeroReactionType } from '../../QuestPerform';
import QuestHero, { BattleAction } from '../process-helpers/QuestHero';
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
  MONSTER_MOVE,
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

  reacted: Map<HeroReactionType, number[]>;

  // Т.к. герой может реагировать каждый раунд пришлось придумать такую переключалку
  // иначе анимация не поймёт что ей надо переиграть, т.к. класс в HeroItem уже будет выставлен в анимацию
  heroHittedMemo: number[];
  heroHealedMemo: number[];

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

      reacted: new Map(),
      heroHittedMemo: [],
      heroHealedMemo: [],

      eventMessages: [],
      processState: ProcessState.LOADING,
      monsters: [],
      drops: [],
      battleEvents: new Map(),
    };
  }

  componentDidMount() {
    const { checkpoint } = this.props;

    const monsters = [...checkpoint.enemies!.map((e) => convertToActor(e))];

    this.setState(
      {
        actorsQueue: [...this.props.heroes, ...monsters],
        reacted: initialReactions(),
        monsters,
        processState: ProcessState.SWITCH_ACTOR,
        beginTime: new Date(),
        eventMessages: [new EventMessage(2, { x: 0, y: 0 }, 72, 'BEGIN', rgba(255, 255), Direction.CENTER, Effect.FADE_IN_OUT)],
      },
      () => this.processRound()
    );
  }

  componentWillUnmount() {
    this.state.monsters.forEach((e) => {
      e.drop.forEach((d) => (d.dropped = undefined));
    });
  }

  processRound() {
    if (this.checkBattleComplete()) {
      return;
    }

    switch (this.state.processState) {
      case ProcessState.LOADING:
      case ProcessState.BATTLE_WON:
      case ProcessState.BATTLE_LOST:
      case ProcessState.PLAYER_MOVE:
        //do nothing
        break;

      case ProcessState.SWITCH_ACTOR:
        let queueIdx = this.state.currentActorIdx + 1;
        if (queueIdx === this.state.actorsQueue.length) {
          queueIdx = 0;
        }

        const currentActor = this.state.actorsQueue[queueIdx];
        const processState = currentActor.isHero ? ProcessState.PLAYER_MOVE : ProcessState.MONSTER_MOVE;

        this.setState(
          {
            currentActor,
            processState,
            currentActorIdx: queueIdx,
          },
          () => this.processRound()
        );
        break;

      case ProcessState.MONSTER_MOVE:
        const monster = this.state.currentActor as CheckpointActor;
        const heroes = this.props.heroes.filter((h) => isAlive(h));
        const victim = heroes[Math.floor(Math.random() * heroes.length)];
        const damage = Math.max(1, monster.stats.power - victim.stats.defence - victim.equipStats.defence);
        victim.health -= damage;

        this.setState(
          {
            processState: ProcessState.SWITCH_ACTOR,
          },
          () => this.processRound()
        );
        break;

      default:
        throw new Error(`Process ${ProcessState[this.state.processState]} is not implemented yet!`);
    }
  }

  handleClickMonster = (monster: CheckpointActor) => {
    const { currentActor } = this.state;
    if (currentActor && currentActor.isHero) {
      const hero = currentActor as QuestHero;
      if (hero.action === BattleAction.ATTACK) {
        const damage = Math.max(1, hero.stats.power + hero.equipStats.power - monster.stats.defence);
        monster.currentHealth -= damage;
        this.setState({ processState: ProcessState.SWITCH_ACTOR }, () => this.processRound());
      }
    }
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
    const won = this.state.monsters.every((m) => m.currentHealth <= 0);
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
    const { monsters, currentActor, processState, reacted, heroHittedMemo, heroHealedMemo } = this.state;
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

        <HeroesPanel
          actors={heroes}
          current={currentActor?.isHero ? (currentActor as QuestHero) : undefined}
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
