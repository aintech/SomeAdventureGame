import { Component, createRef, MouseEvent } from "react";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint, { BattleActionType, BattleRound, CheckpointType } from "../../../../models/QuestCheckpoint";
import Loader from "../../../loader/Loader";
import CheckpointActor, { convertToActor } from "../process-helpers/CheckpointActor";
import "./checkpoint-process.scss";
import { create } from "../process-helpers/Color";
import {
  drawActors,
  drawMessages,
  drawTreasure,
  drawCompleted,
  prepare,
  clearDynamicCtx,
} from "../process-helpers/DrawManager";
import { Direction, Effect, EventMessage } from "../process-helpers/EventMessage";
import { ImageType } from "../process-helpers/ImageLoader";

enum ProcessState {
  LOADING,

  PREPARE,
  BATTLE,
  BATTLE_LOST,

  CHEST_CRACKING,

  CHECKPOINT_COMPLETED,
}

type CheckpointProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  closeCheckpoint: () => void;
  checkpointPassed: () => void;
  moveOnwards: (e: MouseEvent) => void;
};

type CheckpointProcessState = {
  seconds: number;
  eventMessages: EventMessage[];
  actors: CheckpointActor[];
  processState: ProcessState;
  beginTime?: Date;
};

class CheckpointProcess extends Component<CheckpointProcessProps, CheckpointProcessState> {
  private roundTimer?: NodeJS.Timeout;
  private frameTimer?: NodeJS.Timeout;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private canvas?: HTMLCanvasElement;
  private dynamicCanvasRef: React.RefObject<HTMLCanvasElement>;
  private dynamicCanvas?: HTMLCanvasElement;

  constructor(props: CheckpointProcessProps) {
    super(props);
    this.state = {
      seconds: 0,
      eventMessages: [],
      actors: [],
      processState: ProcessState.LOADING,
    };
    this.canvasRef = createRef();
    this.dynamicCanvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.updateRound = this.updateRound.bind(this);
    this.updateFrame = this.updateFrame.bind(this);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current!;
    this.dynamicCanvas = this.dynamicCanvasRef.current!;

    const { checkpoint, heroes } = this.props;

    this.setState({
      actors: [
        ...heroes.map((h, idx) => convertToActor(h, idx, this.canvas!.height)),
        ...(checkpoint.enemies ? checkpoint.enemies.map((e, idx) => convertToActor(e, idx, this.canvas!.height)) : []),
      ].sort((a, b) => b.index - a.index),
    });

    prepare(
      this.canvas.getContext("2d")!,
      this.dynamicCanvas.getContext("2d")!,
      [
        ImageType.ENEMY,
        ImageType.GRAVESTONE,
        ImageType.CHEST_CLOSED,
        ImageType.CHEST_OPEN,
        ImageType.REWARD_BACK,
        ImageType.REWARD_GOLD,
      ],
      [ImageType.HERO, ImageType.CRAB, ImageType.PLANT, ImageType.SLIME, ImageType.SPIDER, ImageType.ZOMBIE]
    ).then((_) =>
      this.setState({
        processState: ProcessState.PREPARE,
        beginTime: new Date(),
        eventMessages:
          checkpoint.type === CheckpointType.BATTLE
            ? [new EventMessage(2, { x: 0, y: 0 }, 72, "BEGIN", create(255, 255), Direction.CENTER, Effect.FADE_IN_OUT)]
            : [],
      })
    );

    this.startTimers();
  }

  componentWillUnmount() {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
    }
    if (this.frameTimer) {
      clearInterval(this.frameTimer);
    }
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
        //do nothing
        break;
      case ProcessState.PREPARE:
        switch (this.props.checkpoint.type) {
          case CheckpointType.BATTLE:
            if (seconds >= 2) {
              processState = ProcessState.BATTLE;
              seconds = 0;
              beginTime = new Date();

              this.setState({ processState, beginTime, seconds, eventMessages: [] });
            }
            break;
          case CheckpointType.TREASURE:
            processState = ProcessState.CHEST_CRACKING;
            this.setState({ processState });
            break;
          default:
            throw new Error(`${CheckpointType[this.props.checkpoint.type]} is not implemented yet!`);
        }
        break;
      case ProcessState.BATTLE:
        const round = this.props.checkpoint.rounds!.get(seconds);
        if (round) {
          this.processRound(round);
        }
        this.checkBattleComplete();
        break;
      case ProcessState.BATTLE_LOST:
      case ProcessState.CHEST_CRACKING:
      case ProcessState.CHECKPOINT_COMPLETED:
        //do nothing
        break;
      default:
        throw new Error(`Process ${ProcessState[processState]} is not implemented yet!`);
    }
  }

  updateFrame() {
    if (this.state.processState !== ProcessState.LOADING) {
      this.draw();
    }
    this.checkEndedMessages();
  }

  draw() {
    clearDynamicCtx();

    drawActors(this.state.actors);

    if (this.state.processState === ProcessState.CHEST_CRACKING) {
      drawTreasure(this.props.checkpoint);
    }

    drawMessages(this.state.eventMessages);

    if (this.state.processState === ProcessState.CHECKPOINT_COMPLETED) {
      drawCompleted(this.props.checkpoint, []);
    }
  }

  processRound(round: BattleRound[]) {
    const messages: EventMessage[] = [];
    let events: {
      isHeroAttack: boolean;
      victimId: number;
      position: { x: number; y: number };
      amount: number;
    }[] = [];

    round.forEach((r) => {
      switch (r.action) {
        case BattleActionType.HERO_ATTACK:
        case BattleActionType.ENEMY_ATTACK:
          const isHeroAttack = r.action === BattleActionType.HERO_ATTACK;
          const victim = this.state.actors.find(
            (a) => a.isHero !== isHeroAttack && a.actorId === (isHeroAttack ? r.enemyId : r.heroId)
          )!;
          victim.currentHealth -= r.hpAdjust!;
          const existsIdx = events.findIndex((e) => e.isHeroAttack === isHeroAttack && e.victimId === victim.actorId);
          if (existsIdx === -1) {
            events.push({ isHeroAttack, victimId: victim.actorId, position: victim.position, amount: r.hpAdjust! });
          } else {
            const existsMsg = events[existsIdx];
            const updatedMsg = {
              isHeroAttack,
              victimId: victim.actorId,
              position: victim.position,
              amount: r.hpAdjust! + existsMsg.amount,
            };
            events = [...events.slice(0, existsIdx), updatedMsg, ...events.slice(existsIdx + 1)];
          }
          break;
        case BattleActionType.USE_POTION:
          const actor = this.state.actors.find((a) => a.isHero && a.actorId === r.heroId)!;
          actor.currentHealth += r.hpAdjust!;
          messages.push(
            new EventMessage(
              2,
              actor.position,
              32,
              `+${r.hpAdjust} hp`,
              create(0, 255),
              Direction.LEFT,
              Effect.FLY_AWAY
            )
          );
          break;
        default:
          throw new Error(`Unknown battle action type ${BattleActionType[r.action]}`);
      }
    });

    events.map((e) =>
      messages.push(
        new EventMessage(
          2,
          e.position,
          32,
          `-${e.amount} hp`,
          create(255),
          e.isHeroAttack ? Direction.RIGHT : Direction.LEFT,
          Effect.FLY_AWAY
        )
      )
    );

    this.setState((state) => {
      return { eventMessages: [...state.eventMessages, ...messages] };
    });
  }

  checkBattleComplete() {
    if (this.state.actors.filter((a) => !a.isHero && a.currentHealth > 0).length === 0) {
      this.setState({ processState: ProcessState.CHECKPOINT_COMPLETED });
      this.props.checkpointPassed();
    } else if (this.state.actors.filter((a) => a.isHero && a.currentHealth > 0).length === 0) {
      this.setState({ processState: ProcessState.BATTLE_LOST });
    }
  }

  canvasClickHandler(e: MouseEvent) {
    const { processState } = this.state;
    if (processState === ProcessState.CHEST_CRACKING) {
      this.setState({ processState: ProcessState.CHECKPOINT_COMPLETED });
      this.props.checkpointPassed();
    }
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

  render() {
    return (
      <div className="checkpoint-process">
        {this.state.processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        <canvas width={750} height={400} ref={this.canvasRef} onClick={(e) => this.canvasClickHandler(e)}></canvas>
        <canvas width={750} height={400} ref={this.dynamicCanvasRef}></canvas>
        {this.state.processState === ProcessState.CHECKPOINT_COMPLETED ? (
          <button className="checkpoint-process__btn--onwards" onClick={(e) => this.props.moveOnwards(e)}>
            Дальше в подземелье
          </button>
        ) : null}
      </div>
    );
  }
}

export default CheckpointProcess;
