import React, { Component, createRef, MouseEvent } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { beginQuestPerform, collectingQuestReward, showConfirmDialog } from "../../../../actions/Actions";
import { onCancelQuest, onCheckpointPassed } from "../../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../../hoc/WithApiService";
import horseImgSrc from "../../../../img/quest-travel/quest-travel_animation.gif";
import backgroundImgSrc from "../../../../img/quest-travel/quest-travel_background.png";
import heroImgSrc from "../../../../img/quest-travel/quest-travel_hero.png";
import Hero from "../../../../models/hero/Hero";
import Quest from "../../../../models/Quest";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import store from "../../../../Store";
import Gif from "../../../../utils/Gif";
import GifLoader from "../../../../utils/gif-loader";
import { convertDuration, millisToSecs, toGameplayScale } from "../../../../utils/Utils";
import { QuestPerformData } from "../../quest-perform/QuestPerform";
import "./quest-travel-item.scss";

type QuestProgressItemProps = {
  quest: Quest;
  heroes: Hero[];
  activeQuestPerform?: QuestPerformData;
  collectingQuestReward: (quest: Quest) => void;
  beginQuestPerform: (quest: Quest, heroes: Hero[]) => void;
  onCheckpointPassed: (quest: Quest, checkpoint: QuestCheckpoint) => void;
  onCancelQuest: (quest: Quest) => void;
};

type QuestProgressItemState = {
  /** Сколько секунд прошло с отправки на квест */
  seconds: number;
  bgOffset: number;
  images: Map<string, HTMLImageElement>;
  gifs: Map<string, Gif>;
};

class QuestProgressItem extends Component<QuestProgressItemProps, QuestProgressItemState> {
  private secondsTimer?: NodeJS.Timeout;
  private updateTimer?: NodeJS.Timeout;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private canvas?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D;

  constructor(props: QuestProgressItemProps) {
    super(props);
    this.state = {
      seconds: 0,
      bgOffset: 0,
      images: new Map(),
      gifs: new Map(),
    };
    this.canvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.countSeconds = this.countSeconds.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current!;
    this.canvasCtx = this.canvas.getContext("2d")!;

    this.loadImage("background", backgroundImgSrc);
    this.loadImage("hero", heroImgSrc);
    this.loadGif("horse", horseImgSrc);

    const { quest } = this.props;

    const seconds = Math.floor(millisToSecs(new Date().getTime() - quest.progress!.embarkedTime));

    this.setState({ seconds });

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

  loadGif(name: string, src: string) {
    const loader = GifLoader();
    loader.load(src);
    loader.onload = (event: any) => {
      const gifs = new Map(this.state.gifs);
      gifs.set(name, event.path[0]);
      this.setState({ gifs });
    };
  }

  startTimers() {
    if (!this.secondsTimer) {
      this.secondsTimer = setInterval(this.countSeconds, 1000);
    }
    if (!this.updateTimer) {
      this.updateTimer = setInterval(this.update, 1000 / 40);
    }
  }

  countSeconds() {
    const secondsPassed = Math.floor(millisToSecs(new Date().getTime() - this.props.quest.progress!.embarkedTime));
    if (secondsPassed <= 0) {
      this.setState({
        seconds: Math.floor(millisToSecs(new Date().getTime() - this.props.quest.progress!.embarkedTime)),
      });
    }
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
    if (this.state.seconds < 0) {
      this.calcDrawOffset();
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
      if (this.state.seconds < 0) {
        this.canvasCtx.drawImage(backImg, this.state.bgOffset, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.drawImage(
          backImg,
          this.state.bgOffset + this.canvas.width - 1,
          0,
          this.canvas.width,
          this.canvas.height
        );
      } else {
        this.canvasCtx.drawImage(backImg, 0, 0, this.canvas.width, this.canvas.height);
      }
    }

    /* Draw traveler to quest location */
    const horseGif = this.state.gifs.get("horse");
    if (horseGif && this.state.seconds < 0) {
      for (let i = 0; i < this.props.heroes.length; i++) {
        this.canvasCtx.drawImage(horseGif.image, 10, -5, 80, 72);
        this.drawStroked(this.canvasCtx, "Герои в пути", 70, 35, "aqua");
      }
    }

    /* Draw heroes */
    const heroImg = this.state.images.get("hero");
    if (heroImg && this.state.seconds >= 0) {
      for (let i = 0; i < this.props.heroes.length; i++) {
        this.canvasCtx.drawImage(heroImg, 50 - i * 10, 14 + i * 1, toGameplayScale(48), toGameplayScale(54));
      }
    }
  }

  drawStroked(ctx: CanvasRenderingContext2D, msg: string, x: number, y: number, color: string) {
    ctx.font = "16px Pattaya";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(msg, x, y);
    ctx.fillStyle = color;
    // ctx.miterLimit = 2;
    ctx.fillText(msg, x, y);
    ctx.lineCap = "round";
  }

  beginQuest() {
    this.props.beginQuestPerform(this.props.quest, this.props.heroes);
  }

  //TODO: При отмене квеста лут и опыт остаются, но сам квест пропадает с доски квестов (или становится временно недоступным)
  cancelQuest(e: MouseEvent) {
    e.preventDefault();
    this.props.onCancelQuest(this.props.quest);
  }

  render() {
    const { quest } = this.props;

    let description;

    if (this.props.activeQuestPerform) {
      description = "На квесет";
    } else if (this.state.seconds >= 0) {
      description = "Лагерь";
    } else {
      description = convertDuration(-this.state.seconds);
    }

    const dismissBtnClass = "quest-travel-item__btn--dismiss" + (this.props.activeQuestPerform ? "__hidden" : "");

    return (
      <div className="quest-travel-item">
        <div className="quest-travel-item__title">{quest.title}</div>

        <div className="quest-travel-item__tribute">{quest.tribute}</div>

        <div className="quest-travel-item__duration">{description}</div>

        <canvas
          width={toGameplayScale(244)}
          height={toGameplayScale(75)}
          style={{
            marginLeft: `${toGameplayScale(35)}px`,
            zIndex: -1,
            marginTop: `-5px`,
            gridRow: 2,
            gridColumn: `1 / -1`,
          }}
          ref={this.canvasRef}
        ></canvas>

        <button
          className="quest-travel-item__btn--start"
          style={{ display: this.state.seconds >= 0 && !this.props.activeQuestPerform ? "block" : "none" }}
          onClick={this.beginQuest.bind(this)}
        >
          {quest.progress!.checkpoints.find((c) => !c.passed) ? "Lets Go ->" : "Collect ->"}
        </button>

        <button
          className={dismissBtnClass}
          onClick={(e) =>
            store.dispatch(
              showConfirmDialog(
                `Герои вернутся в гильдию, найденные сокровища и полученный опыт останутся с ними. 
                Сам квест будет какое-то время недоступен для выполнения`,
                this.cancelQuest.bind(this),
                e
              )
            )
          }
        ></button>
      </div>
    );
  }
}

const mapStateToProps = ({ activeQuestPerform }: { activeQuestPerform?: QuestPerformData }) => {
  return { activeQuestPerform };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      collectingQuestReward,
      beginQuestPerform,
      onCheckpointPassed: onCheckpointPassed(apiService, auth),
      onCancelQuest: onCancelQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(QuestProgressItem);
