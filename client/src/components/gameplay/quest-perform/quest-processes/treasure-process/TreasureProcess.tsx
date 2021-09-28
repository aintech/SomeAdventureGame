import { MouseEvent } from "react";
import { clickInBox, distance, lerpXY, Position } from "../../../../../utils/Utils";
import Loader from "../../../../loader/Loader";
import {
  clearCtx as clearDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawTarget,
  drawTreasure,
  drawTreasureChestCracked,
  prepare,
} from "../process-helpers/DrawManager";
import { defineDrop } from "../process-helpers/Drop";
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
  private chestPos: Position & { rotation: number; clickTime: number } = { x: 0, y: 0, rotation: 0, clickTime: 0 };
  private targetPos: Position = { x: 0, y: 0 };
  private dropChunks: { time: number; gold: number }[] = [];
  private dropsInitiated: boolean = false;

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

    this.targetPos = {
      x: 100 + Math.random() * (this.dynamicCanvasRef.current!.width - 200),
      y: 100 + Math.random() * 50,
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
    if (this.state.processState !== ProcessState.LOADING && this.state.beginTime) {
      let seconds = this.state.seconds;
      seconds += 1; //Math.floor((new Date().getTime() - this.state.beginTime!.getTime()) * 0.001);
      this.setState({ seconds });
    }
  }

  updateFrame() {
    if (this.state.processState === ProcessState.LOADING) {
      return;
    }

    if (this.state.processState === ProcessState.CRACKING) {
      if (this.chestPos.y < 0) {
        this.chestPos.y += Math.min(10, (new Date().getTime() - this.chestPos.clickTime) * 0.01);
        this.chestPos.rotation = lerpXY(this.chestPos.rotation, 0, 0.1);
      } else if (this.chestPos.rotation !== 0) {
        this.chestPos.rotation = 0;
      }
    }

    if (this.state.processState === ProcessState.DROPS) {
      const time = new Date().getTime();
      const idx = this.dropChunks.findIndex((d) => time >= d.time);

      if (idx !== -1) {
        const drop = defineDrop(
          { fraction: 1, gold: this.dropChunks.splice(idx, 1)[0].gold, dropped: true },
          this.dynamicCanvasRef.current!,
          undefined,
          this.targetPos
        );

        this.setState((state) => {
          return { drops: [...state.drops, drop] };
        });
      }

      if (this.dropsInitiated) {
        if (this.dropChunks.length === 0 && this.state.drops.filter((d) => !d.collected && !d.timeouted).length === 0) {
          this.props.setHeroRewards(this.calcHeroRewards(false));
          this.setState({ processState: ProcessState.AFTERMATH });
        }
      }
    }

    this.drawFrame();
    this.updateCommon();
  }

  drawStatic() {
    clearDrawCtx();

    if (this.state.processState === ProcessState.DROPS || this.state.processState === ProcessState.AFTERMATH) {
      drawTreasureChestCracked(this.props.checkpoint, this.state.processState === ProcessState.AFTERMATH);
    }
    if (this.state.processState !== ProcessState.LOADING) {
      drawTarget(this.targetPos, 50);
    }
  }

  drawFrame() {
    clearDynamicDrawCtx();
    drawTreasure(
      this.props.checkpoint,
      this.state.processState === ProcessState.DROPS || this.state.processState === ProcessState.AFTERMATH,
      this.chestPos
    );
    this.drawCommon();
  }

  checkTreasureInTarget() {
    const chestPos = {
      x: this.dynamicCanvasRef.current!.width * 0.5 + this.chestPos.x,
      y: this.dynamicCanvasRef.current!.height + this.chestPos.y - 100,
    };

    if (distance(this.targetPos, chestPos) < 60) {
      this.chestPos.rotation = 0;
      this.chestPos.x = this.targetPos.x - this.dynamicCanvasRef.current!.width * 0.5;
      this.chestPos.y = this.targetPos.y - this.dynamicCanvasRef.current!.height + 100;

      this.prepareTreasureDrops();

      this.setState({ processState: ProcessState.DROPS }, () => {
        this.drawStatic();
      });
    }
  }

  prepareTreasureDrops() {
    const { tribute } = this.props.checkpoint;

    let total = 0;
    let time = new Date().getTime();

    for (;;) {
      let gold = Math.ceil(Math.random() * tribute * 0.1);
      if (total + gold > tribute) {
        gold = tribute - gold;
      }

      time += (0.1 + Math.random() + 0.2) * 1000;
      this.dropChunks.push({ time, gold });
      total += gold;

      if (total >= tribute) {
        break;
      }
    }

    this.dropsInitiated = true;
  }

  canvasClickHandler(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (this.state.processState === ProcessState.CRACKING) {
      const click = this.getClickPoint(e);
      const chestPos = {
        x: this.dynamicCanvasRef.current!.width * 0.5 + this.chestPos.x,
        y: this.dynamicCanvasRef.current!.height + this.chestPos.y - 100,
      };

      if (clickInBox(click, { center: chestPos, edgeHalf: 60 })) {
        this.chestPos.clickTime = new Date().getTime();
        const xOff = click.x - chestPos.x;

        if (this.chestPos.y > -350) {
          this.chestPos.y -= Math.random() * 20 + 20;
        }

        this.chestPos.rotation -= Math.random() * xOff;
        this.chestPos.x -= Math.random() * xOff;
      }

      this.checkTreasureInTarget();
    }

    if (this.state.processState === ProcessState.DROPS) {
      this.checkDropClicked(this.getClickPoint(e));
    }
  }

  completeCheckpointClickHandler(e: MouseEvent) {
    this.props.moveOnwards(this.collectedTreasureDrops());
  }

  collectedTreasureDrops() {
    return [{ actorId: 0, drops: this.dropChunks.map((d) => d.gold) }];
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
