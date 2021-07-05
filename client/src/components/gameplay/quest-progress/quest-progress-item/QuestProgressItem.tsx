import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { collectingQuestReward } from "../../../../actions/Actions";
import { onCheckpointPassed } from "../../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../../hoc/WithApiService";
import chestClosedImgSrc from "../../../../img/quest-progress/Chest_closed.png";
import chestOpenImgSrc from "../../../../img/quest-progress/Chest_open.png";
import backgroundImgSrc from "../../../../img/quest-progress/quest-progress_background.png";
import heroImgSrc from "../../../../img/quest-progress/quest-progress_hero.png";
import skeletonImgSrc from "../../../../img/quest-progress/Skeleton.png";
import skeletonDeadImgSrc from "../../../../img/quest-progress/Skeleton_dead.png";
import Hero from "../../../../models/hero/Hero";
import Quest from "../../../../models/Quest";
import QuestCheckpoint, {
  CheckpointAction,
  CheckpointActionType,
  CheckpointEnemy,
  CheckpointType,
} from "../../../../models/QuestCheckpoint";
import {
  convertDuration,
  millisToSecs,
  toGameplayScale,
} from "../../../../utils/Utils";
import ActorItemList from "./actor-item-list/ActorItemList";
import { ActorItemType, convertToActor } from "./actor-item/ActorItem";
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
  onCheckpointPassed: (quest: Quest, checkpoint: QuestCheckpoint) => void;
};

type QuestProgressItemState = {
  /** Сколько секунд прошло с НАЧАЛА квеста */
  seconds: number;
  bgOffset: number;
  images: Map<string, HTMLImageElement>;
  eventMessages: EventMessage[];
  activeCheckpoint: QuestCheckpoint | null;
  willBeSpendOnCheckpoints: number;
  spendedOnCheckpoints: number;
  actors: ActorItemType[];
};

//FIXME: Во время взлома ящика пропадают иконки героев
class QuestProgressItem extends Component<
  QuestProgressItemProps,
  QuestProgressItemState
> {
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
      images: new Map(),
      eventMessages: [],
      activeCheckpoint: null,
      willBeSpendOnCheckpoints: 0,
      spendedOnCheckpoints: 0,
      actors: [],
    };
    this.canvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current!;
    this.canvasCtx = this.canvas.getContext("2d")!;

    this.loadImage("chest_closed", chestClosedImgSrc);
    this.loadImage("chest_open", chestOpenImgSrc);
    this.loadImage("background", backgroundImgSrc);
    this.loadImage("hero", heroImgSrc);
    this.loadImage("skeleton", skeletonImgSrc);
    this.loadImage("skeleton_dead", skeletonDeadImgSrc);

    const { quest, heroes } = this.props;

    const seconds = Math.floor(
      millisToSecs(new Date().getTime() - quest.progress!.embarkedTime)
    );

    this.setState({
      seconds,
      actors: heroes.map((h) => convertToActor(h)),
      // currentX: 20 + Math.floor(160 - 160 * (seconds / quest.duration)),
    });

    this.calcWillBeSpendOnCheckpoints(seconds);

    this.checkIfCheckpointOccured(seconds);

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

  loadImage(name: string, src: string) {
    const image = new Image();
    image.src = src;
    image.addEventListener(
      "load",
      (ev) => {
        const images = new Map(this.state.images);
        images.set(name, ev.currentTarget as HTMLImageElement);
        this.setState({ images });
      },
      false
    );
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
  setAsActiveCheckpoint(checkpoint: QuestCheckpoint, actors: ActorItemType[]) {
    this.setState({
      activeCheckpoint: checkpoint,
      actors,
    });
  }

  finishActiveCheckpoint() {
    const { activeCheckpoint } = this.state;

    if (!activeCheckpoint) {
      return;
    }

    const msg = `+${activeCheckpoint!.tribute} g`;
    this.sendMessage(msg);

    this.calcWillBeSpendOnCheckpoints(this.state.seconds);

    const actors = this.state.actors.filter((a) => a.isHero);

    this.setState({
      activeCheckpoint: null,
      actors,
    });

    this.props.onCheckpointPassed(this.props.quest, activeCheckpoint);
  }

  sendMessage(message: string, color = "yellow", direction = Direction.LEFT) {
    const event = new EventMessage(new Date(), message, color, direction);
    this.setState((state) => {
      return { eventMessages: [...state.eventMessages, event] };
    });
  }

  countSeconds() {
    if (!this.state.activeCheckpoint) {
      this.checkIfCheckpointOccured(this.state.seconds);
    }
    this.setState((state) => {
      return {
        seconds: state.seconds + 1,
      };
    });

    if (this.state.activeCheckpoint) {
      this.checkCheckpointActions();
    }
  }

  checkIfCheckpointOccured(seconds: number) {
    for (const checkpoint of this.props.quest.progress!.checkpoints) {
      if (
        !checkpoint.passed &&
        seconds >= checkpoint.occuredTime &&
        seconds < checkpoint.occuredTime + checkpoint.duration
      ) {
        let actors: ActorItemType[] = [];
        if (checkpoint.type === CheckpointType.BATTLE) {
          const secOffset = seconds - checkpoint.occuredTime;

          const heroActors = this.props.heroes.map((h) => convertToActor(h));
          const enemyActors = checkpoint.enemies.map((e) => convertToActor(e));
          actors = [...heroActors, ...enemyActors];
          checkpoint.outcome.forEach((value, key) => {
            if (key <= secOffset && value) {
              for (const action of value) {
                this.actorReactAction(action, actors);
              }
            }
          });
        }

        this.setAsActiveCheckpoint(checkpoint, actors);
        return;
      }
    }
  }

  checkCheckpointActions() {
    const checkpoint = this.state.activeCheckpoint!;
    if (checkpoint.type === CheckpointType.BATTLE) {
      const secOffset = this.state.seconds - checkpoint.occuredTime;
      const steps = checkpoint.outcome.get(secOffset);
      if (!steps) {
        return;
      }

      const mergedDamage = new Map<CheckpointActionType, number>();
      for (const step of steps!) {
        this.actorReactAction(step, this.state.actors);
        mergedDamage.set(
          step.action!,
          (mergedDamage.get(step.action!) ?? 0) + step.damage
        );
      }
      mergedDamage.forEach(this.createBattleMessage.bind(this));
    }
  }

  actorReactAction(action: CheckpointAction, actors: ActorItemType[]) {
    if (action.action === CheckpointActionType.HERO_ATTACK) {
      const enemy = actors.find(
        (a) => !a.isHero && a.actorId === action.enemyId
      );
      enemy!.currentHealth -= action.damage;
    }

    if (action.action === CheckpointActionType.ENEMY_ATTACK) {
      const hero = actors.find((a) => a.isHero && a.actorId === action.heroId);
      hero!.currentHealth -= action.damage;
    }
  }

  createBattleMessage(value: number, key: CheckpointActionType) {
    const direction =
      key === CheckpointActionType.HERO_ATTACK
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
    const backImg = this.state.images.get("background");
    if (backImg) {
      this.canvasCtx.drawImage(
        backImg,
        this.state.bgOffset,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.canvasCtx.drawImage(
        backImg,
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
          this.drawEnemy(checkpoint.enemies, diff, passed);
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
    const heroImg = this.state.images.get("hero");
    if (heroImg && !this.questFinished()) {
      for (let i = 0; i < this.props.heroes.length; i++) {
        this.canvasCtx.drawImage(
          heroImg,
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
      !this.state.images.has("chest_open") ||
      !this.state.images.has("chest_closed")
    ) {
      return;
    }

    const offset = 80 + diff / 80;
    if (!passed) {
      this.canvasCtx.drawImage(
        this.state.images.get("chest_closed")!,
        offset,
        16,
        toGameplayScale(36),
        toGameplayScale(46)
      );
    } else {
      this.canvasCtx.drawImage(
        this.state.images.get("chest_open")!,
        offset,
        16,
        toGameplayScale(36),
        toGameplayScale(46)
      );
    }
  }

  drawEnemy(enemies: CheckpointEnemy[], diff: number, passed: boolean) {
    if (
      !this.canvasCtx ||
      !this.state.images.has("skeleton") ||
      !this.state.images.has("skeleton_dead")
    ) {
      return;
    }

    const offset = 80 + diff / 80;
    for (let i = 0; i < enemies.length; i++) {
      if (!passed) {
        this.canvasCtx.drawImage(
          this.state.images.get("skeleton")!,
          offset + i * 10,
          16 + i * 2,
          toGameplayScale(36),
          toGameplayScale(46)
        );
      } else {
        this.canvasCtx.drawImage(
          this.state.images.get("skeleton_dead")!,
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
    const { actors } = this.state;

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

        <canvas
          width={toGameplayScale(244)}
          height={toGameplayScale(75)}
          style={{
            marginLeft: `${toGameplayScale(35)}px`,
            zIndex: -1,
            marginTop: `-5px`,
          }}
          ref={this.canvasRef}
        ></canvas>

        <div
          className="quest-progress-item__chest"
          style={{ display: questFinished ? "block" : "none" }}
          onClick={this.collectReward.bind(this)}
        ></div>

        <button className="quest-progress-item__btn--dismiss"></button>

        <div className="quest-progress-item__actors">
          <ActorItemList actors={actors} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      collectingQuestReward,
      onCheckpointPassed: onCheckpointPassed(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(null, mapDispatchToProps)
)(QuestProgressItem);
