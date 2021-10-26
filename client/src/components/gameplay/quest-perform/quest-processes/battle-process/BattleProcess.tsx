import { MouseEvent } from "react";
import Loader from "../../../../loader/Loader";
import CheckpointActor, { convertToActor } from "../../quest-processes/process-helpers/CheckpointActor";
import { create } from "../../quest-processes/process-helpers/Color";
import {
  addToHitsDrawQueue,
  clearCtx as clearDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawBattleCompleted,
  drawHits,
  drawOpponent,
  getPixel,
  prepare,
} from "../../quest-processes/process-helpers/DrawManager";
import { defineDrop } from "../../quest-processes/process-helpers/Drop";
import { Direction, Effect, EventMessage } from "../../quest-processes/process-helpers/EventMessage";
import { getTypeByName, getUrlByName, ImageType } from "../../quest-processes/process-helpers/ImageLoader";
import QuestProcess, { QuestProcessProps, QuestProcessState } from "../QuestProcess";
import "./battle-process.scss";

enum ProcessState {
  LOADING,
  PREPARE,
  BATTLE,
  BATTLE_WON,
  BATTLE_LOST,
}

const mandatoryImages = () => {
  return [ImageType.RESULT_BACK, ImageType.RESULT_GOLD];
};

const mandatoryGifs = () => {
  return [ImageType.ATTACK];
};

type BattleProcessProps = QuestProcessProps & {
  heroHit: (heroId: number, hpLoss: number) => void;
  resetAnim: () => void;
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
  processState: ProcessState;
  enemies: CheckpointActor[];
  currentEnemy?: CheckpointActor;
  clickPower: number;
  battleEvents: Map<number, HeroEvent[]>; // heroId to events
};

//TODO: Периодически герои дропают пикапы соответственно своим скилам, если на них кликнуть скилл сработает

class BattleProcess extends QuestProcess<BattleProcessProps, BattleProcessState> {
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
    this.onUnmount();
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

    this.drawFrame();
    this.updateCommon();
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
    this.drawCommon();
  }

  canvasClickHandler(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.state.processState === ProcessState.BATTLE) {
      if (this.state.currentEnemy) {
        const click = this.getClickPoint(e);

        if (this.checkDropClicked(click)) {
          return;
        }

        const clickPoint = getPixel(click);

        if (!clickPoint) {
          return;
        }

        if (clickPoint.data[3] === 0) {
          return;
        }

        addToHitsDrawQueue(click);

        const { currentEnemy } = this.state;

        const damage = this.state.clickPower - currentEnemy.stats.defence;
        if (damage > 0) {
          currentEnemy.currentHealth -= damage;

          const drop = currentEnemy.drop.find((d) => !d.dropped && d.fraction >= currentEnemy.currentHealth);
          if (drop) {
            drop.dropped = true;
            const { drops } = this.state;
            drops.push(defineDrop(drop, this.dynamicCanvasRef.current!, currentEnemy.actorId));
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

  checkEnemyActions(seconds: number) {
    if (seconds <= 0) {
      return;
    }
    this.props.resetAnim();

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
        this.props.setHeroRewards(this.calcHeroRewards(true));
      }

      return true;
    }
    return false;
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
        if (collected.has(drop.actorId!)) {
          collected.get(drop.actorId!)!.push(drop.appearAt!);
        } else {
          collected.set(drop.actorId!, [drop.appearAt!]);
        }
      });

    return collected;
  }

  childRender() {
    const { processState } = this.state;
    return (
      <>
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
      </>
    );
  }
}

export default BattleProcess;