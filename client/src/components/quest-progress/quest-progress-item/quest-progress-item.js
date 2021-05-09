import React, { Component, createRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { collectingQuestReward } from "../../../actions/actions.js";
import progressBG from "../../../img/quest-progress/quest-progress_background.png";
import heroImgSrc from "../../../img/quest-progress/quest-progress_hero.png";
import chestImgSrc from "../../../img/quest-progress/quest-progress_chest.png";
import { convertDuration, toGameplayScale } from "../../../utils/utils.js";
import "./quest-progress-item.scss";

class QuestProgressItem extends Component {
  constructor() {
    super();
    this.state = {
      seconds: 0,
      bgOffset: 0,
      backImg: null,
      heroImg: null,
      chestImg: null,
      checkpoints: [],
      activeCheckpoint: null,
    };
    this.secondsTimer = 0;
    this.framesTimer = 0;
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
    this.countFrames = this.countFrames.bind(this);
    this.canvasRef = createRef();
    this.canvas = null;
    this.canvasCtx = null;
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.canvasCtx = this.canvas.getContext("2d");

    const { quest } = this.props;
    const seconds = Math.floor(
      quest.duration - (new Date() - quest.embarkedTime) / 1000
    );

    this.setState({
      seconds: seconds,
      // currentX: 20 + Math.floor(160 - 160 * (seconds / quest.duration)),
    });
    this.startTimers();
  }

  componentWillUnmount() {
    clearInterval(this.secondsTimer);
    clearInterval(this.framesTimer);
  }

  startTimers() {
    if (this.secondsTimer === 0) {
      this.secondsTimer = setInterval(this.countSeconds, 1000);
    }
    if (this.framesTimer === 0) {
      this.framesTimer = setInterval(this.countFrames, 1000 / 20);
    }
  }

  countSeconds() {
    // if (this.state.activeCheckpoint) {
    //   this.checkCheckpointStillActive();
    //   return;
    // }
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });

    // this.checkAnyCheckpointActive();

    if (seconds <= 0) {
      clearInterval(this.secondsTimer);
      clearInterval(this.framesTimer);
      this.draw();
    }
  }

  // _checkpointHappensNow(checkpoint) {
  //   return (
  //     checkpoint.occureTime > new Date(new Date() - 10000) &&
  //     checkpoint.occureTime < new Date()
  //   );
  // }

  // checkAnyCheckpointActive() {
  //   const { quest } = this.props;
  //   const checkpoints = quest.checkpoints;
  //   for (const checkpoint of checkpoints) {
  //     if (this._checkpointHappensNow(checkpoint)) {
  //       this.setState({ activeCheckpoint: checkpoint });
  //     }
  //   }
  // }

  // checkCheckpointStillActive() {
  //   const isEnded =
  //     this.state.activeCheckpoint.occureTime < new Date(new Date() - 10000);
  //   if (isEnded) {
  //     this.setState({ activeCheckpoint: null });
  //   }
  // }

  countFrames() {
    // if (!this.state.activeCheckpoint) {
    let offset = this.state.bgOffset - 1;
    if (offset < -this.canvas.width) {
      offset += this.canvas.width;
    }
    this.setState({
      bgOffset: offset,
    });
    // }

    this.draw();
  }

  draw() {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* Draw background */
    if (this.state.backImg) {
      this.canvasCtx.drawImage(
        this.state.backImg,
        this.state.seconds > 0 && this.state.bgOffset,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.canvasCtx.drawImage(
        this.state.backImg,
        this.state.seconds > 0 && this.state.bgOffset + this.canvas.width - 1,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }

    /* Draw hero */
    if (this.state.heroImg && this.state.seconds > 0) {
      this.canvasCtx.drawImage(
        this.state.heroImg,
        50,
        16,
        toGameplayScale(48),
        toGameplayScale(54)
      );
    }

    if (this.state.chestImg) {
      for (const checkpoint of this.props.quest.checkpoints) {
        const off = checkpoint.occureTime.getTime() - new Date().getTime();
        if (off > -1000) {
          const offset = 80 + off / 80;

          this.canvasCtx.drawImage(
            this.state.chestImg,
            offset,
            16,
            toGameplayScale(36),
            toGameplayScale(46)
          );
        }
      }
    }

    // if (this.state.activeCheckpoint && this.state.chestImg) {
    //   this.canvasCtx.drawImage(
    //     this.state.chestImg,
    //     80,
    //     12,
    //     toGameplayScale(48),
    //     toGameplayScale(54)
    //   );
    // }
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
    const { seconds } = this.state;
    const questFinished = seconds <= 0;

    return (
      <div className="quest-progress-item">
        <div className="quest-progress-item__title">{quest.title}</div>

        <div className="quest-progress-item__tribute">{quest.tribute}</div>

        <div className="quest-progress-item__duration">
          {questFinished ? "DONE" : convertDuration(seconds)}
        </div>

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
      collectingQuestReward: collectingQuestReward,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(QuestProgressItem);
