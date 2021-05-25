import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { collectingQuestReward } from "../../../actions/Actions";
import AuthContext, { AuthProps } from "../../../contexts/AuthContext";
import withApiService from "../../../hoc/WithApiService";
import chestClosedImgSrc from "../../../img/quest-progress/Chest_closed.png";
import chestOpenImgSrc from "../../../img/quest-progress/Chest_open.png";
import progressBG from "../../../img/quest-progress/quest-progress_background.png";
import heroImgSrc from "../../../img/quest-progress/quest-progress_hero.png";
import skeletonImgSrc from "../../../img/quest-progress/Skeleton.png";
import skeletonDeadImgSrc from "../../../img/quest-progress/Skeleton_dead.png";
import Hero from "../../../models/Hero";
import Quest from "../../../models/Quest";
import QuestCheckpoint, {
  CheckpointActionType,
  CheckpointActor,
  CheckpointType,
} from "../../../models/QuestCheckpoint";
import {
  convertDuration,
  millisToSecs,
  toGameplayScale,
} from "../../../utils/Utils";
import "./quest-progress-item.scss";

enum Direction {
  LEFT,
  RIGHT,
}

class EventMessage {
  constructor(
    public fireTime: Date,
    public message: string,
    public color: string,
    public direction: Direction
  ) {}
}

type QuestProgressItemProps = {
  quest: Quest;
  heroes: Hero[];
  collectingQuestReward: (quest: Quest) => void;
};

type QuestProgressItemState = {
  /** Сколько секунд прошло с НАЧАЛА квеста */
  seconds: number;
  bgOffset: number;
  backImg: HTMLImageElement | null;
  heroImg: HTMLImageElement | null;
  chestClosedImg: HTMLImageElement | null;
  chestOpenImg: HTMLImageElement | null;
  skeletonImg: HTMLImageElement | null;
  skeletonDeadImg: HTMLImageElement | null;
  eventMessages: EventMessage[];
  activeCheckpoint: QuestCheckpoint | null;
  willBeSpendOnCheckpoints: number;
  spendedOnCheckpoints: number;
};

class QuestProgressItem extends Component<
  QuestProgressItemProps,
  QuestProgressItemState
> {
  static contextType = AuthContext;

  private auth: AuthProps | null = null;
  private secondsTimer: NodeJS.Timeout | null = null;
  private updateTimer: NodeJS.Timeout | null = null;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement | null = null;
  private canvasCtx: CanvasRenderingContext2D | null = null;

  constructor(props: QuestProgressItemProps) {
    super(props);
    this.state = {
      seconds: 0,
      bgOffset: 0,
      backImg: null,
      heroImg: null,
      chestClosedImg: null,
      chestOpenImg: null,
      skeletonImg: null,
      skeletonDeadImg: null,
      eventMessages: [],
      activeCheckpoint: null,
      willBeSpendOnCheckpoints: 0,
      spendedOnCheckpoints: 0,
    };
    this.canvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.auth = this.context;
    this.canvas = this.canvasRef.current!;
    this.canvasCtx = this.canvas.getContext("2d")!;

    const { quest } = this.props;
    const seconds = Math.floor(
      millisToSecs(new Date().getTime() - quest.progress!.embarkedTime)
    );

    this.setState({
      seconds,
      // currentX: 20 + Math.floor(160 - 160 * (seconds / quest.duration)),
    });

    this.calcWillBeSpendOnCheckpoints(seconds);

    this.checkIfCheckpointOccured();

    this.startTimers();
  }

  componentWillUnmount() {
    if (this.secondsTimer) {
      clearInterval(this.secondsTimer);
    }
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }

  startTimers() {
    if (!this.secondsTimer) {
      this.secondsTimer = setInterval(this.countSeconds, 1000);
    }
    if (!this.updateTimer) {
      this.updateTimer = setInterval(this.update, 1000 / 20);
    }
  }

  calcWillBeSpendOnCheckpoints(seconds: number) {
    const { quest } = this.props;

    const willBeSpendOnCheckpoints = quest
      .progress!.checkpoints.filter((c) => c.occuredTime >= seconds)
      .map((c) => +c.duration)
      .reduce((a, b) => a + b, 0);

    const spendedOnCheckpoints = quest
      .progress!.checkpoints.filter((c) => c.occuredTime < seconds)
      .map((c) => +c.duration)
      .reduce((a, b) => a + b, 0);

    this.setState({
      willBeSpendOnCheckpoints,
      spendedOnCheckpoints,
    });
  }

  /**
   * TODO: Активный чекпоинт рисовать отдельным экранчиком с анимацией боя или вскрытия сундука
   */
  setAsActiveCheckpoint(checkpoint: QuestCheckpoint) {
    this.setState({
      activeCheckpoint: checkpoint,
    });
  }

  finishActiveCheckpoint() {
    const { activeCheckpoint } = this.state;

    if (activeCheckpoint!.type === CheckpointType.TREASURE) {
      const msg = `+${activeCheckpoint!.outcome.get(0)![0].value} g`;
      this.sendMessage(msg);
    }

    this.calcWillBeSpendOnCheckpoints(this.state.seconds);
    this.setState({
      activeCheckpoint: null,
    });
  }

  sendMessage(message: string, color = "yellow", direction = Direction.LEFT) {
    const event = new EventMessage(new Date(), message, color, direction);
    this.setState((state) => {
      return { eventMessages: [...state.eventMessages, event] };
    });
  }

  countSeconds() {
    if (!this.state.activeCheckpoint) {
      this.checkIfCheckpointOccured();
    }
    const seconds = this.state.seconds + 1;
    this.setState((state) => {
      return {
        seconds: state.seconds + 1,
      };
    });

    if (this.state.activeCheckpoint) {
      this.checkCheckpointActions();
    }

    if (seconds <= 0) {
      if (this.secondsTimer) {
        clearInterval(this.secondsTimer);
      }
      if (this.updateTimer) {
        clearInterval(this.updateTimer);
      }
      this.draw();
    }
  }

  checkIfCheckpointOccured() {
    for (const checkpoint of this.props.quest.progress!.checkpoints) {
      if (
        this.state.seconds >= checkpoint.occuredTime &&
        this.state.seconds < checkpoint.occuredTime + checkpoint.duration
      ) {
        this.setAsActiveCheckpoint(checkpoint);
        return;
      }
    }
  }

  checkCheckpointActions() {
    const checkpoint = this.state.activeCheckpoint!;
    if (checkpoint.type === CheckpointType.BATTLE) {
      const sec = this.state.seconds - checkpoint.occuredTime;
      const actions = checkpoint.outcome.get(sec);
      if (actions && actions.length > 0) {
        const merged = new Map<CheckpointActionType, number>();
        for (const action of actions) {
          merged.set(
            action.type!,
            (merged.get(action.type!) ?? 0) + action.value
          );
        }
        merged.forEach(this.createBattleMessage.bind(this));
      }
    }
  }

  createBattleMessage(value: number, key: CheckpointActionType) {
    const direction =
      key === CheckpointActionType.HERO_ATTACK_OPPONENT
        ? Direction.RIGHT
        : Direction.LEFT;
    this.sendMessage(`-${value} hp`, "red", direction);
  }

  calcDrawOffset() {
    if (this.canvas) {
      let offset = this.state.bgOffset - 1;
      if (offset < -this.canvas.width) {
        offset += this.canvas.width;
      }
      this.setState({
        bgOffset: offset,
      });
    }
  }

  update() {
    if (!this.state.activeCheckpoint) {
      if (!this.questFinished()) {
        this.calcDrawOffset();
      }
    } else {
      const { activeCheckpoint } = this.state;
      if (
        this.state.seconds >
        activeCheckpoint.occuredTime + activeCheckpoint.duration
      ) {
        this.finishActiveCheckpoint();
      }
    }

    this.draw();
  }

  draw() {
    if (!this.canvas || !this.canvasCtx) {
      return;
    }

    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* Draw background */
    if (this.state.backImg) {
      this.canvasCtx.drawImage(
        this.state.backImg,
        this.state.bgOffset,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.canvasCtx.drawImage(
        this.state.backImg,
        this.state.bgOffset + this.canvas.width - 1,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    /* Draw checkpoints obstacles */
    for (const checkpoint of this.props.quest.progress!.checkpoints) {
      /** Здесь пока используем  милисекунды для отрисовки позиции более плавно */
      const passed =
        checkpoint.occuredTime + checkpoint.duration < this.state.seconds;

      let diff = 0;
      if (this.state.activeCheckpoint) {
        diff = this.state.activeCheckpoint.id === checkpoint.id ? -800 : 800000;
      } else {
        diff =
          this.props.quest.progress!.embarkedTime +
          checkpoint.occuredTime * 1000 +
          (passed
            ? /**
               * Магическое значение которое позволяет отрисовывать прошедший чекпоинт где положено
               * может время потраченое на последний чекпоинт???
               */
              10000
            : 0) -
          new Date().getTime();
      }

      switch (checkpoint.type) {
        case CheckpointType.TREASURE:
          this.drawChest(diff, passed);
          break;
        case CheckpointType.BATTLE:
          this.drawEnemy(checkpoint.actors, diff, passed);
          break;
        default:
          throw new Error(
            `unknown checkpoint type in draw call: ${
              CheckpointType[checkpoint.type]
            }`
          );
      }
    }

    /* Draw heroes */
    if (this.state.heroImg && !this.questFinished()) {
      for (let i = 0; i < this.props.heroes.length; i++) {
        this.canvasCtx.drawImage(
          this.state.heroImg,
          50 - i * 10,
          14 + i * 1,
          toGameplayScale(48),
          toGameplayScale(54)
        );
      }
    }

    /* Draw event messages */
    for (const msg of this.state.eventMessages) {
      const direction = msg.direction === Direction.RIGHT ? -1 : 1;
      const off = (msg.fireTime.getTime() - new Date().getTime()) / 100;
      const startPoint = msg.direction === Direction.RIGHT ? 90 : 20;
      this.drawStroked(
        this.canvasCtx,
        msg.message,
        startPoint + off * direction,
        35 + off,
        msg.color
      );
    }
  }

  drawStroked(
    ctx: CanvasRenderingContext2D,
    msg: string,
    x: number,
    y: number,
    color: string
  ) {
    ctx.font = "bold 16px Nunito";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.strokeText(msg, x, y);
    ctx.fillStyle = color;
    ctx.miterLimit = 2;
    ctx.fillText(msg, x, y);
    // ctx.scale(0.25, 0.25);
  }

  drawChest(diff: number, passed: boolean) {
    if (
      !this.canvasCtx ||
      !this.state.chestOpenImg ||
      !this.state.chestClosedImg
    ) {
      return;
    }

    const offset = 80 + diff / 80;
    if (!passed) {
      this.canvasCtx.drawImage(
        this.state.chestClosedImg,
        offset,
        16,
        toGameplayScale(36),
        toGameplayScale(46)
      );
    } else {
      this.canvasCtx.drawImage(
        this.state.chestOpenImg,
        offset,
        16,
        toGameplayScale(36),
        toGameplayScale(46)
      );
    }
  }

  drawEnemy(actors: CheckpointActor[], diff: number, passed: boolean) {
    if (
      !this.canvasCtx ||
      !this.state.skeletonImg ||
      !this.state.skeletonDeadImg
    ) {
      return;
    }

    const offset = 80 + diff / 80;
    for (let i = 0; i < actors.length; i++) {
      if (!passed) {
        this.canvasCtx.drawImage(
          this.state.skeletonImg,
          offset + i * 10,
          16 + i * 2,
          toGameplayScale(36),
          toGameplayScale(46)
        );
      } else {
        this.canvasCtx.drawImage(
          this.state.skeletonDeadImg,
          offset + i * 10,
          16 + i * 2,
          toGameplayScale(36),
          toGameplayScale(46)
        );
      }
    }
  }

  questFinished() {
    return this.props.quest.progress!.duration - this.state.seconds <= 0;
  }

  collectReward() {
    this.props.collectingQuestReward(this.props.quest);
  }

  render() {
    const { quest } = this.props;
    const remainSeconds =
      quest.progress!.duration -
      this.state.seconds -
      this.state.willBeSpendOnCheckpoints;

    const questFinished = this.questFinished();

    let description;

    if (questFinished) {
      description = "DONE";
    } else if (this.state.activeCheckpoint) {
      switch (this.state.activeCheckpoint.type) {
        case CheckpointType.TREASURE:
          description = "Cracking";
          break;
        case CheckpointType.BATTLE:
          description = "Battle";
          break;
        default:
          throw new Error(
            `unknown checkpoint type: ${
              CheckpointType[this.state.activeCheckpoint.type]
            }`
          );
      }
    } else {
      description = convertDuration(remainSeconds);
    }

    return (
      <div className="quest-progress-item">
        <div className="quest-progress-item__title">{quest.title}</div>

        <div className="quest-progress-item__tribute">{quest.tribute}</div>

        <div className="quest-progress-item__duration">{description}</div>

        <img
          src={progressBG}
          onLoad={(e) => this.setState({ backImg: e.currentTarget })}
          style={{ display: "none" }}
          alt=""
        />
        <img
          src={heroImgSrc}
          onLoad={(e) => this.setState({ heroImg: e.currentTarget })}
          style={{ display: "none" }}
          alt=""
        />
        <img
          src={chestClosedImgSrc}
          onLoad={(e) => this.setState({ chestClosedImg: e.currentTarget })}
          style={{ display: "none" }}
          alt=""
        />
        <img
          src={chestOpenImgSrc}
          onLoad={(e) => this.setState({ chestOpenImg: e.currentTarget })}
          style={{ display: "none" }}
          alt=""
        />

        <img
          src={skeletonImgSrc}
          onLoad={(e) => this.setState({ skeletonImg: e.currentTarget })}
          style={{ display: "none" }}
          alt=""
        />
        <img
          src={skeletonDeadImgSrc}
          onLoad={(e) => this.setState({ skeletonDeadImg: e.currentTarget })}
          style={{ display: "none" }}
          alt=""
        />

        <canvas
          width={toGameplayScale(244)}
          height={toGameplayScale(65)}
          style={{
            marginLeft: `${toGameplayScale(35)}px`,
            zIndex: -1,
          }}
          ref={this.canvasRef}
        ></canvas>

        <div
          className="quest-progress-item__chest"
          style={{ display: questFinished ? "block" : "none" }}
          onClick={this.collectReward.bind(this)}
        ></div>

        <button className="quest-progress-item__btn--dismiss"></button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      collectingQuestReward,
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(null, mapDispatchToProps)
)(QuestProgressItem);
