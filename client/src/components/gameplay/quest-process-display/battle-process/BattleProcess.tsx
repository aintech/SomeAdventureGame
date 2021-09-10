import { Component, createRef, MouseEvent } from "react";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import { distance, lerp, Position } from "../../../../utils/Utils";
import Loader from "../../../loader/Loader";
import CheckpointActor, { convertToActor } from "../process-helpers/CheckpointActor";
import { create } from "../process-helpers/Color";
import {
  clearCtx as clearDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawBattleCompleted,
  drawDrops,
  drawHits,
  drawMessages,
  drawOpponent,
  dropToHits,
  prepare,
} from "../process-helpers/DrawManager";
import { defineDrop, Drop, DropType } from "../process-helpers/Drop";
import { Direction, Effect, EventMessage } from "../process-helpers/EventMessage";
import { getTypeByName, getUrlByName, ImageType } from "../process-helpers/ImageLoader";
import "./battle-process.scss";

enum ProcessState {
  LOADING,
  PREPARE,
  BATTLE,
  BATTLE_WON,
  BATTLE_LOST,
}

const mandatoryImages = () => {
  return [ImageType.REWARD_BACK, ImageType.REWARD_GOLD];
};

const mandatoryGifs = () => {
  return [ImageType.ATTACK];
};

type BattleProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  heroHit: (heroId: number, hpLoss: number) => void;
  resetAnim: () => void;
  closeCheckpoint: () => void;
  // checkpointPassed: () => void;
  setHeroRewards: (rewards: Map<number, { gold: number; experience: number }>) => void;
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

type BattleProcessState = {
  seconds: number;
  eventMessages: EventMessage[];
  processState: ProcessState;
  beginTime?: Date;
  enemies: CheckpointActor[];
  currentEnemy?: CheckpointActor;
  clickPower: number;
  drops: Drop[];
  battleEvents: Map<number, HeroEvent[]>; // heroId to events
};

class BattleProcess extends Component<BattleProcessProps, BattleProcessState> {
  private roundTimer?: NodeJS.Timeout;
  private frameTimer?: NodeJS.Timeout;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private dynamicCanvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props: BattleProcessProps) {
    super(props);
    this.state = {
      seconds: 0,
      eventMessages: [],
      processState: ProcessState.LOADING,
      enemies: [],
      clickPower: 0,
      drops: [],
      battleEvents: new Map(),
    };
    this.canvasRef = createRef();
    this.dynamicCanvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.updateRound = this.updateRound.bind(this);
    this.updateFrame = this.updateFrame.bind(this);
  }

  componentDidMount() {
    const { checkpoint } = this.props;

    const enemies = [...checkpoint.enemies!.map((e, idx) => convertToActor(e, idx))].sort((a, b) => a.index - b.index);

    const clickPower = this.props.heroes.reduce((a, b) => a + b.stats.power + b.equipStats.power, 0);

    this.setState({ enemies, currentEnemy: enemies[0], clickPower });

    this.canvasRef.current!.onselectstart = () => {
      return false;
    };
    this.dynamicCanvasRef.current!.onselectstart = () => {
      return false;
    };

    const enemyImgTypes = enemies.map((e) => getTypeByName(e.type));

    prepare(
      this.canvasRef.current!.getContext("2d")!,
      this.dynamicCanvasRef.current!.getContext("2d")!,
      [...mandatoryImages(), ...enemyImgTypes],
      [...mandatoryGifs()]
    ).then((_) => {
      this.setState({
        processState: ProcessState.PREPARE,
        beginTime: new Date(),
        eventMessages: [
          new EventMessage(2, { x: 0, y: 0 }, 72, "BEGIN", create(255, 255), Direction.CENTER, Effect.FADE_IN_OUT),
        ],
      });

      this.drawStatic();
    });

    this.startTimers();
  }

  componentWillUnmount() {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
    }
    if (this.frameTimer) {
      clearInterval(this.frameTimer);
    }

    this.state.enemies.forEach((e) => {
      e.drop.forEach((d) => (d.dropped = undefined));
    });
  }

  startTimers() {
    if (!this.roundTimer) {
      this.roundTimer = setInterval(this.updateRound, 1000);
    }
    if (!this.frameTimer) {
      this.frameTimer = setInterval(this.updateFrame, 1000 / 40);
    }
  }

  updateRound() {
    let seconds = this.state.seconds;
    let processState = this.state.processState;
    let beginTime = this.state.beginTime;

    if (processState !== ProcessState.LOADING && beginTime) {
      seconds += 1; //Math.floor((new Date().getTime() - this.state.beginTime!.getTime()) * 0.001);
      this.setState({ seconds });
    }

    switch (processState) {
      case ProcessState.LOADING:
      case ProcessState.BATTLE_WON:
      case ProcessState.BATTLE_LOST:
        //do nothing
        break;
      case ProcessState.PREPARE:
        if (seconds >= 2) {
          processState = ProcessState.BATTLE;
          seconds = 0;
          beginTime = new Date();

          this.setState({ processState, beginTime, seconds, eventMessages: [] });
        }
        break;
      case ProcessState.BATTLE:
        this.checkEnemyActions(seconds);
        break;
      default:
        throw new Error(`Process ${ProcessState[processState]} is not implemented yet!`);
    }
    this.checkBattleComplete();
  }

  updateFrame() {
    if (this.state.processState === ProcessState.LOADING) {
      return;
    }
    this.moveDrops();
    this.drawFrame();
    this.checkEndedMessages();
    this.checkTimeoutedDrops();
  }

  moveDrops() {
    this.state.drops
      .filter((d) => !d.collected && !d.timeouted)
      .forEach((drop) => {
        if (distance(drop.position, drop.target) > 5) {
          drop.position = lerp(drop.position, drop.target, 0.08);
        }
      });
  }

  drawStatic() {
    clearDrawCtx();

    const { currentEnemy, processState } = this.state;

    if (currentEnemy) {
      drawOpponent(currentEnemy);
    }

    if (processState === ProcessState.BATTLE_WON || processState === ProcessState.BATTLE_LOST) {
      drawBattleCompleted(this.props.checkpoint, processState === ProcessState.BATTLE_WON, this.state.drops);
    }
  }

  drawFrame() {
    clearDynamicDrawCtx();
    drawHits();
    drawDrops(this.state.drops.filter((d) => !d.collected && !d.timeouted));
    drawMessages(this.state.eventMessages);
  }

  canvasClickHandler(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.state.processState === ProcessState.BATTLE) {
      if (this.state.currentEnemy) {
        const rect = this.canvasRef.current!.getBoundingClientRect();
        const click = { x: e.clientX - rect.left, y: e.clientY - rect.top };

        if (this.checkDropClicked(click)) {
          return;
        }

        dropToHits(click);

        const { currentEnemy } = this.state;

        const damage = this.state.clickPower - currentEnemy.stats.defence;
        if (damage > 0) {
          currentEnemy.currentHealth -= damage;

          const drop = currentEnemy.drop.find((d) => !d.dropped && d.fraction >= currentEnemy.currentHealth);
          if (drop) {
            drop.dropped = true;
            const { drops } = this.state;
            drops.push(defineDrop(currentEnemy.actorId, drop, this.canvasRef.current!));
            this.setState({ drops });
          }

          const { eventMessages } = this.state;
          eventMessages.push(
            new EventMessage(1, click, 32, `- ${damage} hp`, create(255), Direction.RIGHT, Effect.FLY_AWAY)
          );

          this.setState({ currentEnemy, eventMessages }, () => this.drawStatic());
        }
      }
      this.checkCurrentEnemy();
    }
  }

  checkDropClicked(click: Position) {
    const { drops } = this.state;

    const msgs: EventMessage[] = [];
    drops.forEach((drop) => {
      if (!drop.collected && !drop.timeouted) {
        if (
          drop.position.x <= click.x &&
          drop.position.x + drop.dimensions.width >= click.x &&
          drop.position.y <= click.y &&
          drop.position.y + drop.dimensions.height >= click.y
        ) {
          drop.collected = true;
          msgs.push(
            new EventMessage(1, click, 32, `+ ${drop.amount} g`, create(255, 255), Direction.RIGHT, Effect.FLY_AWAY)
          );
        }
      }
    });

    if (msgs.length > 0) {
      this.setState((state) => {
        return { drops, eventMessages: [...state.eventMessages, ...msgs] };
      });
      return true;
    }

    return false;
  }

  checkEnemyActions(seconds: number) {
    if (seconds <= 0) {
      return;
    }
    this.props.resetAnim();

    console.log(seconds);

    this.state.enemies
      .filter((e) => e.currentHealth > 0)
      .forEach((enemy) => {
        if (seconds % enemy.stats.initiative === 0) {
          const aliveHeroes = this.props.heroes.filter((h) => h.health > 0);
          if (aliveHeroes.length > 0) {
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            if (enemy.stats.power > target.stats.defence + target.equipStats.defence) {
              let damage = enemy.stats.power - target.stats.defence - target.equipStats.defence;
              if (damage > target.health) {
                damage = target.health;
              }
              this.props.heroHit(target.id, damage);

              const { battleEvents } = this.state;
              const event = { time: new Date().getTime(), hpAlter: -damage };
              if (battleEvents.has(target.id)) {
                battleEvents.get(target.id)!.push(event);
              } else {
                battleEvents.set(target.id, [event]);
              }
              this.setState({ battleEvents });
            }
          }
        }
      });
  }

  checkCurrentEnemy() {
    if ((this.state.currentEnemy?.currentHealth ?? 1) <= 0) {
      if (!this.checkBattleComplete()) {
        const currentEnemy = this.state.enemies.find((e) => e.currentHealth > 0)!;
        this.setState({ currentEnemy }, () => this.drawStatic());
      }
    }
  }

  switchCurrentEnemy(actor: CheckpointActor) {
    if (this.state.processState === ProcessState.BATTLE && actor.currentHealth > 0) {
      const currentEnemy = this.state.enemies.find((e) => e.actorId === actor.actorId);
      this.setState({ currentEnemy }, () => this.drawStatic());
    }
  }

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

      this.setState(
        {
          drops,
          processState: won ? ProcessState.BATTLE_WON : ProcessState.BATTLE_LOST,
          currentEnemy: undefined,
        },
        () => this.drawStatic()
      );

      if (won) {
        this.props.setHeroRewards(this.calcHeroRewards());
      }

      return true;
    }
    return false;
  }

  calcHeroRewards() {
    const rewards = new Map<number, { gold: number; experience: number }>();

    const { checkpoint } = this.props;
    const { heroes } = this.props;
    const { drops } = this.state;

    let experience = 0;
    let gold = 0;
    if (checkpoint.enemies) {
      experience = Math.ceil(checkpoint.enemies.reduce((a, b) => a + b.experience, 0) / heroes.length);
      const collectedGold = drops
        .filter((d) => d.type === DropType.GOLD && d.collected)
        .reduce((a, b) => a + b.amount, 0);

      gold = Math.ceil((collectedGold + checkpoint.tribute) / heroes.length);
    }

    heroes.forEach((h) => rewards.set(h.id, { gold, experience }));

    return rewards;
  }

  completeCheckpointClickHandler(e: MouseEvent) {
    this.props.moveOnwards(
      this.state.processState === ProcessState.BATTLE_WON,
      this.collectCheckpointDrops(),
      this.state.battleEvents
    );
  }

  collectCheckpointDrops() {
    const collected: Map<number, number[]> = new Map();
    if (this.state.processState === ProcessState.BATTLE_LOST) {
      return collected;
    }

    this.state.drops
      .filter((drop) => drop.collected)
      .forEach((drop) => {
        if (collected.has(drop.actorId)) {
          collected.get(drop.actorId)!.push(drop.appearAt);
        } else {
          collected.set(drop.actorId, [drop.appearAt]);
        }
      });

    return collected;
  }

  checkEndedMessages() {
    const endedMessages = this.state.eventMessages.filter(
      (m) => m.fireTime().getTime() + m.lifetime * 1000 < new Date().getTime()
    );

    if (endedMessages.length > 0) {
      const filteredMessages = this.state.eventMessages;
      for (let i = 0; i < endedMessages.length; i++) {
        const idx = filteredMessages.findIndex((m) => m.id() === endedMessages[i].id());
        filteredMessages.splice(idx, 1);
      }
      this.setState({ eventMessages: filteredMessages });
    }
  }

  checkTimeoutedDrops() {
    const { drops } = this.state;
    const time = new Date().getTime();

    drops.forEach((d) => {
      if (!d.collected && !d.timeouted && d.lifeTill < time) {
        d.timeouted = true;
      }
    });

    this.setState({ drops });
  }

  render() {
    const { processState } = this.state;
    return (
      <div className="battle-process">
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        <canvas className="battle-process__canvas" width={650} height={500} ref={this.canvasRef}></canvas>
        <canvas
          className="battle-process__canvas--dynamic"
          width={650}
          height={500}
          ref={this.dynamicCanvasRef}
          onClick={(e) => this.canvasClickHandler(e)}
        ></canvas>
        {processState === ProcessState.BATTLE_WON ? (
          <button className="battle-process__btn--onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            На карту локации
          </button>
        ) : processState === ProcessState.BATTLE_LOST ? (
          <button className="battle-process__btn--onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            Отступить
          </button>
        ) : null}
        <div className="battle-process__opponents-holder">
          {this.state.enemies.map((e) => (
            <div key={e.actorId}>
              <img
                className={`battle-process__opponent-portrait${
                  e.actorId === this.state.currentEnemy?.actorId
                    ? "--current"
                    : e.currentHealth <= 0
                    ? "--disabled"
                    : ""
                }`}
                src={getUrlByName(`${e.type}-prt`)}
                alt="enemy"
                onClick={() => this.switchCurrentEnemy(e)}
              />
              <span style={{ fontFamily: "inherit", fontSize: "14px", color: "white" }}>
                {e.name}
                {`${e.currentHealth > 0 ? " - " + e.currentHealth : ""}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default BattleProcess;
