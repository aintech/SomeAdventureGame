import { Component, createRef, MouseEvent } from "react";
import EnemyPortraitSrc from "../../../../img/quest-process-display/actors/enemy-portrait.png";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import { distance, lerp, Position } from "../../../../utils/Utils";
import Loader from "../../../loader/Loader";
import CheckpointActor, { convertToActor } from "../process-helpers/CheckpointActor";
import { create } from "../process-helpers/Color";
import {
  clearCtx as clearDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawCompleted,
  drawDrops,
  drawHits,
  drawMessages,
  drawOpponent,
  dropToHits,
  prepare,
} from "../process-helpers/DrawManager";
import { defineDrop, Drop, DropType } from "../process-helpers/Drop";
import { Direction, Effect, EventMessage } from "../process-helpers/EventMessage";
import { ImageType } from "../process-helpers/ImageLoader";
import "./battle-process.scss";

enum ProcessState {
  LOADING,
  PREPARE,
  BATTLE,
  POST_BATTLE,
}

type BattleProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  closeCheckpoint: () => void;
  // checkpointPassed: () => void;
  setHeroRewards: (rewards: Map<number, { gold: number; experience: number }>) => void;
  moveOnwards: (e: MouseEvent, collected: { actorId: number; drops: number[] }[]) => void;
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

    const clickPower = this.props.heroes.reduce((a, b) => a + b.stats.power, 0);

    this.setState({ enemies, currentEnemy: enemies[0], clickPower });

    this.canvasRef.current!.onselectstart = () => {
      return false;
    };
    this.dynamicCanvasRef.current!.onselectstart = () => {
      return false;
    };

    prepare(
      this.canvasRef.current!.getContext("2d")!,
      this.dynamicCanvasRef.current!.getContext("2d")!,
      [ImageType.SNAKE, ImageType.REWARD_BACK, ImageType.REWARD_GOLD],
      [ImageType.ATTACK]
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
      case ProcessState.BATTLE:
      case ProcessState.POST_BATTLE:
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
      default:
        throw new Error(`Process ${ProcessState[processState]} is not implemented yet!`);
    }
  }

  updateFrame() {
    if (this.state.processState !== ProcessState.LOADING) {
      this.moveDrops();
      this.drawFrame();
    }
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

    const { currentEnemy } = this.state;

    if (currentEnemy) {
      drawOpponent(currentEnemy);
    }

    if (this.state.processState === ProcessState.POST_BATTLE) {
      drawCompleted(this.props.checkpoint, this.state.drops);
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
        currentEnemy.currentHealth -= this.state.clickPower;

        const drop = currentEnemy.drop.find((d) => !d.dropped && d.fraction >= currentEnemy.currentHealth);
        if (drop) {
          drop.dropped = true;
          const { drops } = this.state;
          drops.push(defineDrop(currentEnemy.actorId, drop, this.canvasRef.current!));
          this.setState({ drops });
        }

        this.setState({ currentEnemy }, () => this.drawStatic());
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
    if (this.props.heroes.every((h) => h.health <= 0) || this.state.enemies.every((e) => e.currentHealth <= 0)) {
      const { drops } = this.state;
      drops.forEach((d) => {
        if (!d.timeouted && !d.collected) {
          d.collected = true;
        }
      });

      this.setState({ drops, processState: ProcessState.POST_BATTLE, currentEnemy: undefined });
      this.props.setHeroRewards(this.calcHeroRewards());
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
    const { drops } = this.state;
    const collected: { actorId: number; drops: number[] }[] = [];

    drops
      .filter((drop) => drop.collected)
      .forEach((drop) => {
        const exists = collected.find((c) => c.actorId === drop.actorId);
        if (exists) {
          exists.drops.push(drop.appearAt);
        } else {
          collected.push({ actorId: drop.actorId, drops: [drop.appearAt] });
        }
      });

    this.props.moveOnwards(e, collected);
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
    return (
      <div className="battle-process">
        {this.state.processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        <canvas className="battle-process__canvas" width={650} height={500} ref={this.canvasRef}></canvas>
        <canvas
          className="battle-process__canvas--dynamic"
          width={650}
          height={500}
          ref={this.dynamicCanvasRef}
          onClick={(e) => this.canvasClickHandler(e)}
        ></canvas>
        {this.state.processState === ProcessState.POST_BATTLE ? (
          <button className="battle-process__btn--onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            Дальше в подземелье
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
                src={EnemyPortraitSrc}
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
