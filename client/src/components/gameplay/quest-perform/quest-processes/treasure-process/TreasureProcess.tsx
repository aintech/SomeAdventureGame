import { MouseEvent } from "react";
import { Position } from "../../../../../utils/Utils";
import Loader from "../../../../loader/Loader";
import {
  clearCtx as clearDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawMessages,
  drawTreasure,
  prepare,
} from "../process-helpers/DrawManager";
import { ImageType } from "../process-helpers/ImageLoader";
import QuestProcess, { QuestProcessProps, QuestProcessState } from "../QuestProcess";
import "./treasure-process.scss";

enum ProcessState {
  LOADING,
  CRACKING,
  DROPS,
  AFTERMATH,
}

const mandatoryImages = () => {
  return [ImageType.CHEST_CLOSED, ImageType.CHEST_OPEN, ImageType.REWARD_BACK, ImageType.REWARD_GOLD];
};

const mandatoryGifs = () => {
  return [];
};

type TreasureProcessProps = QuestProcessProps & {
  moveOnwards: (collected: { actorId: number; drops: number[] }[]) => void;
};

type TreasureProcessState = QuestProcessState & {
  processState: ProcessState;
};

class TreasureProcess extends QuestProcess<TreasureProcessProps, TreasureProcessState> {
  private chestPos: Position & { rotation: number } = { x: 0, y: 0, rotation: 0 };
  private targetPos: Position = { x: 0, y: 0 };
  private dropValues: { time: number; gold: number }[] = [];

  constructor(props: TreasureProcessProps) {
    super(props);
    this.state = {
      seconds: 0,
      eventMessages: [],
      processState: ProcessState.LOADING,
      drops: [],
    };
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
    this.onUnmount();
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
  }

  updateFrame() {
    if (this.state.processState === ProcessState.LOADING) {
      return;
    }

    if (this.chestPos.y < 0) {
      this.chestPos.y += 2;
    }

    this.drawFrame();
    this.updateCommon();
  }

  drawStatic() {
    clearDrawCtx();
  }

  drawFrame() {
    clearDynamicDrawCtx();
    drawTreasure(
      this.props.checkpoint,
      this.state.processState === ProcessState.DROPS || this.state.processState === ProcessState.AFTERMATH,
      this.chestPos
    );
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

  completeCheckpointClickHandler(e: MouseEvent) {
    this.props.moveOnwards(this.collectedTreasureDrops());
  }

  collectedTreasureDrops() {
    return [{ actorId: 0, drops: [this.props.checkpoint.tribute] }];
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
        {processState === ProcessState.AFTERMATH ? (
          <button className="treasure-process__btn--onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            На карту локации
          </button>
        ) : null}
      </div>
    );
  }
}

export default TreasureProcess;
