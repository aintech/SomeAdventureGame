import { Component, createRef, MouseEvent } from "react";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import { Position } from "../../../../utils/Utils";
import Loader from "../../../loader/Loader";
import {
  clearCtx as clearDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawMessages,
  drawTreasure,
  prepare,
} from "../process-helpers/DrawManager";
import { Drop, DropType } from "../process-helpers/Drop";
import { EventMessage } from "../process-helpers/EventMessage";
import { ImageType } from "../process-helpers/ImageLoader";
import "./treasure-process.scss";

enum ProcessState {
  LOADING,
  CRACKING,
  CRACKED,
}

const mandatoryImages = () => {
  return [ImageType.CHEST_CLOSED, ImageType.CHEST_OPEN, ImageType.REWARD_BACK, ImageType.REWARD_GOLD];
};

const mandatoryGifs = () => {
  return [];
};

type TreasureProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  closeCheckpoint: () => void;
  setHeroRewards: (rewards: Map<number, { gold: number; experience: number }>) => void;
  moveOnwards: (e: MouseEvent) => void;
};

type TreasureProcessState = {
  seconds: number;
  eventMessages: EventMessage[];
  processState: ProcessState;
  beginTime?: Date;
  drops: Drop[];
};

class TreasureProcess extends Component<TreasureProcessProps, TreasureProcessState> {
  private roundTimer?: NodeJS.Timeout;
  private frameTimer?: NodeJS.Timeout;
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private dynamicCanvasRef: React.RefObject<HTMLCanvasElement>;

  private chestPos: Position & { rotation: number } = { x: 0, y: 0, rotation: 0 };

  constructor(props: TreasureProcessProps) {
    super(props);
    this.state = {
      seconds: 0,
      eventMessages: [],
      processState: ProcessState.LOADING,
      drops: [],
    };
    this.canvasRef = createRef();
    this.dynamicCanvasRef = createRef();
    this.startTimers = this.startTimers.bind(this);
    this.updateRound = this.updateRound.bind(this);
    this.updateFrame = this.updateFrame.bind(this);
  }

  componentDidMount() {
    this.canvasRef.current!.onselectstart = () => {
      return false;
    };
    this.dynamicCanvasRef.current!.onselectstart = () => {
      return false;
    };

    prepare(
      this.canvasRef.current!.getContext("2d")!,
      this.dynamicCanvasRef.current!.getContext("2d")!,
      [...mandatoryImages()],
      [...mandatoryGifs()]
    ).then((_) => {
      this.setState(
        {
          processState: ProcessState.CRACKING,
          beginTime: new Date(),
        },
        () => this.drawStatic()
      );
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
      case ProcessState.CRACKED:
      case ProcessState.CRACKING:
        //do nothing
        break;
      default:
        throw new Error(`Process ${ProcessState[processState]} is not implemented yet!`);
    }
  }

  updateFrame() {
    if (this.state.processState === ProcessState.LOADING) {
      return;
    }

    if (this.chestPos.y < 0) {
      this.chestPos.y += 2;
    }

    this.drawFrame();
    this.checkEndedMessages();
  }

  drawStatic() {
    clearDrawCtx();
  }

  drawFrame() {
    clearDynamicDrawCtx();
    drawTreasure(this.props.checkpoint, this.state.processState === ProcessState.CRACKED, this.chestPos);
    drawMessages(this.state.eventMessages);
  }

  //CONTINUE: On click treasure chest shake and jump - higher it gets more treasure it drops
  canvasClickHandler(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (this.chestPos.y > -250) {
      this.chestPos.y -= 30;
    }
    this.chestPos.rotation = Math.random() * 10 - 5;
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
    this.props.moveOnwards(e);
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
    const { processState } = this.state;
    return (
      <div className="treasure-process">
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        <canvas className="treasure-process__canvas" width={650} height={500} ref={this.canvasRef}></canvas>
        <canvas
          className="treasure-process__canvas--dynamic"
          width={650}
          height={500}
          ref={this.dynamicCanvasRef}
          onClick={(e) => this.canvasClickHandler(e)}
        ></canvas>
        {processState === ProcessState.CRACKED ? (
          <button className="treasure-process__btn--onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            На карту локации
          </button>
        ) : null}
      </div>
    );
  }
}

export default TreasureProcess;
