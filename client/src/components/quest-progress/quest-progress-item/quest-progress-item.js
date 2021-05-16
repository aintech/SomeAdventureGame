import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { collectingQuestReward } from "../../../actions/actions.js";
import AuthContext from "../../../contexts/auth-context.js";
import withApiService from "../../../hoc/with-api-service.js";
import progressBG from "../../../img/quest-progress/quest-progress_background.png";
import chestImgSrc from "../../../img/quest-progress/quest-progress_chest.png";
import heroImgSrc from "../../../img/quest-progress/quest-progress_hero.png";
import {
  convertDuration,
  millisToSecs,
  toGameplayScale,
} from "../../../utils/utils.js";
import "./quest-progress-item.scss";

class QuestProgressItem extends Component {
  static contextType = AuthContext;

  constructor() {
    super();
    this.state = {
      /** Сколько секунд прошло с НАЧАЛА квеста */
      seconds: 0,
      bgOffset: 0,
      backImg: null,
      heroImg: null,
      chestImg: null,
      eventMessages: [],
      activeCheckpoint: null,
      willBeSpendOnCheckpoints: 0,
      spendedOnCkecpoints: 0,
    };
    this.secondsTimer = 0;
    this.updateTimer = 0;
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
    this.update = this.update.bind(this);
    this.canvasRef = createRef();
    this.canvas = null;
    this.canvasCtx = null;
  }

  componentDidMount() {
    this.auth = this.context;
    this.canvas = this.canvasRef.current;
    this.canvasCtx = this.canvas.getContext("2d");
    this.canvasCtx.font = "Bold 14pt Nunito";

    const { quest } = this.props;
    const seconds = Math.floor(millisToSecs(new Date() - quest.embarkedTime));

    this.setState({
      seconds,
      // currentX: 20 + Math.floor(160 - 160 * (seconds / quest.duration)),
    });

    this.calcWillBeSpendOnCheckpoints(seconds);

    this.checkIfCheckpointOccured();

    this.startTimers();
  }

  componentWillUnmount() {
    clearInterval(this.secondsTimer);
    clearInterval(this.updateTimer);
  }

  startTimers() {
    if (this.secondsTimer === 0) {
      this.secondsTimer = setInterval(this.countSeconds, 1000);
    }
    if (this.updateTimer === 0) {
      this.updateTimer = setInterval(this.update, 1000 / 20);
    }
  }

  calcWillBeSpendOnCheckpoints(seconds) {
    const { quest } = this.props;
    const willBeSpendOnCheckpoints = quest.checkpoints
      .filter((c) => c.occuredTime >= seconds)
      .map((c) => +c.duration)
      .reduce((a, b) => a + b, 0);

    const spendedOnCheckpoints = quest.checkpoints
      .filter((c) => c.occuredTime < seconds)
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
  setAsActiveCheckpoint(checkpoint) {
    this.setState({
      activeCheckpoint: checkpoint,
    });
  }

  finishActiveQuestEvent() {
    const { activeCheckpoint } = this.state;

    const msg = `+${activeCheckpoint.outcome} g`;

    this.sendMessage(msg);

    this.calcWillBeSpendOnCheckpoints(this.state.seconds);
    this.setState({
      activeCheckpoint: null,
    });
  }

  sendMessage(message, color = "yellow") {
    const event = {
      fireTime: new Date(),
      message,
      color,
    };
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

    if (seconds <= 0) {
      clearInterval(this.secondsTimer);
      clearInterval(this.updateTimer);
      this.draw();
    }
  }

  checkIfCheckpointOccured() {
    for (const checkpoint of this.props.quest.checkpoints) {
      if (
        this.state.seconds >= checkpoint.occuredTime &&
        this.state.seconds < checkpoint.occuredTime + checkpoint.duration
      ) {
        this.setAsActiveCheckpoint(checkpoint);
        return;
      }
    }
  }

  calcDrawOffset() {
    let offset = this.state.bgOffset - 1;
    if (offset < -this.canvas.width) {
      offset += this.canvas.width;
    }
    this.setState({
      bgOffset: offset,
    });
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
        this.finishActiveQuestEvent();
      }
    }

    this.draw();
  }

  draw() {
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
    for (const checkpoint of this.props.quest.checkpoints) {
      /** Здесь пока используем  милисекунды для отрисовки позиции более плавно */
      const passed =
        checkpoint.occuredTime + checkpoint.duration < this.state.seconds;

      let diff = 0;
      if (this.state.activeCheckpoint) {
        diff = this.state.activeCheckpoint.id === checkpoint.id ? -800 : 800000;
      } else {
        diff =
          this.props.quest.embarkedTime +
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
        case "chest":
          this.drawChest(diff, passed);
          break;
        default:
          throw new Error(
            `unknown checkpoint type in draw call: ${checkpoint.type}`
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
    for (const message of this.state.eventMessages) {
      const off = (message.fireTime.getTime() - new Date().getTime()) / 100;
      this.canvasCtx.fillStyle = message.color;
      this.canvasCtx.fillText(message.message, 60 + off, 35 + off);
    }
  }

  drawChest(diff, passed) {
    if (this.state.chestImg) {
      const offset = 80 + diff / 80;
      if (!passed) {
        this.canvasCtx.drawImage(
          this.state.chestImg,
          offset,
          16,
          toGameplayScale(36),
          toGameplayScale(46)
        );
      } else {
        this.canvasCtx.drawImage(
          this.state.chestImg,
          offset,
          24,
          toGameplayScale(36),
          toGameplayScale(46)
        );
      }
    }
  }

  questFinished() {
    return this.props.quest.progressDuration - this.state.seconds <= 0;
  }

  bgLoaded(event) {
    this.setState({ backImg: event.target });
  }

  heroLoaded(event) {
    this.setState({ heroImg: event.target });
  }

  chestLoaded(event) {
    this.setState({ chestImg: event.target });
  }

  collectReward() {
    this.props.collectingQuestReward(this.props.quest);
  }

  render() {
    const { quest } = this.props;
    const remainSeconds =
      quest.progressDuration -
      this.state.seconds -
      this.state.willBeSpendOnCheckpoints;

    const questFinished = this.questFinished();

    let description;

    if (questFinished) {
      description = "DONE";
    } else if (this.state.activeCheckpoint) {
      switch (this.state.activeCheckpoint.type) {
        case "chest":
          description = "Cracking";
          break;
        case "monster":
          description = "Battle";
          break;
        default:
          throw new Error(
            `unknown checkpoint type: ${this.state.activeCheckpoint.type}`
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
          onLoad={this.bgLoaded.bind(this)}
          style={{ display: "none" }}
          alt=""
        />
        <img
          src={heroImgSrc}
          onLoad={this.heroLoaded.bind(this)}
          style={{ display: "none" }}
          alt=""
        />
        <img
          src={chestImgSrc}
          onLoad={this.chestLoaded.bind(this)}
          style={{ display: "none" }}
          alt=""
        />

        <canvas
          width={toGameplayScale(244)}
          height={toGameplayScale(65)}
          style={{
            marginLeft: `${toGameplayScale(35)}px`,
            zIndex: `-1`,
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

const mapDispatchToProps = (dispatch) => {
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
