import React, { Component, createRef, MouseEvent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose, Dispatch } from 'redux';
import { beginQuestPerform, showConfirmDialog } from '../../../../actions/Actions';
import { onCancelQuest, onCheckpointPassed } from '../../../../actions/ApiActions';
import withApiService, { WithApiServiceProps } from '../../../../hoc/WithApiService';
import backgroundImgSrc from '../../../../img/quest-travel/quest-travel_background.png';
import birdImgSrc from '../../../../img/quest-travel/quest-travel_bird.png';
import birdAnimImgSrc from '../../../../img/quest-travel/quest-travel_moving.gif';
import Hero from '../../../../models/hero/Hero';
import Quest from '../../../../models/Quest';
import QuestCheckpoint, { CheckpointStatus, CheckpointType } from '../../../../models/QuestCheckpoint';
import store from '../../../../Store';
import Gif from '../../../../utils/Gif';
import GifLoader from '../../../../utils/gif-loader';
import { convertDuration, millisToSecs } from '../../../../utils/Utils';
import { QuestPerformData } from '../../quest-perform/QuestPerform';
import './quest-travel-item.scss';

type QuestProgressItemProps = {
  quest: Quest;
  heroes: Hero[];
  activeQuestPerform?: QuestPerformData;
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
    this.canvasCtx = this.canvas.getContext('2d')!;

    this.loadImage('background', backgroundImgSrc);
    this.loadImage('bird', birdImgSrc);
    this.loadGif('birdAnim', birdAnimImgSrc);

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
      'load',
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
    const backImg = this.state.images.get('background');
    if (backImg) {
      if (this.state.seconds < 0) {
        this.canvasCtx.drawImage(backImg, this.state.bgOffset, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.drawImage(backImg, this.state.bgOffset + this.canvas.width - 1, 0, this.canvas.width, this.canvas.height);
      } else {
        this.canvasCtx.drawImage(backImg, 0, 0, this.canvas.width, this.canvas.height);
      }
    }

    /* Draw bird travel to quest location */
    const birdAnim = this.state.gifs.get('birdAnim');
    if (birdAnim && this.state.seconds < 0) {
      this.canvasCtx.drawImage(birdAnim.image, 14, 24, 55, 20);
    }

    /* Draw bird arrived */
    const birdImg = this.state.images.get('bird');
    if (birdImg && this.state.seconds >= 0) {
      this.canvasCtx.drawImage(birdImg, 20, 24, 60, 32);
    }
  }

  drawStroked(ctx: CanvasRenderingContext2D, msg: string, x: number, y: number, color: string) {
    ctx.font = '16px Pattaya';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeText(msg, x, y);
    ctx.fillStyle = color;
    // ctx.miterLimit = 2;
    ctx.fillText(msg, x, y);
    ctx.lineCap = 'round';
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

    const cancelBtnClass = 'quest-travel-item__btn-cancel' + (this.props.activeQuestPerform ? '__hidden' : '');

    return (
      <div className="quest-travel-item">
        <div className="quest-travel-item__title">{quest.title}</div>

        <canvas width={160} height={60} className="quest-travel-item__canvas" ref={this.canvasRef}></canvas>

        <button
          className={`quest-travel-item__btn-start ${
            this.state.seconds >= 0 && !this.props.activeQuestPerform ? 'btn-start__visible' : ''
          }`}
          onClick={this.beginQuest.bind(this)}
        >
          {quest.progress!.checkpoints.find((c) => c.type === CheckpointType.BOSS && c.status === CheckpointStatus.COMPLETED)
            ? 'Награда ->'
            : 'Вперед ->'}
        </button>

        <div
          className="quest-travel-item__travel-time"
          style={{ display: this.state.seconds < 0 && !this.props.activeQuestPerform ? 'block' : 'none' }}
        >
          {convertDuration(-this.state.seconds)}
        </div>

        <button
          className={cancelBtnClass}
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
      beginQuestPerform,
      onCheckpointPassed: onCheckpointPassed(apiService, auth),
      onCancelQuest: onCancelQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(QuestProgressItem);
