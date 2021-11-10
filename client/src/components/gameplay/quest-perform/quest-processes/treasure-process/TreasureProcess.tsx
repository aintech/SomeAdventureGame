import { MouseEvent } from "react";
import { clickInBox, distance, lerpXY, Position } from "../../../../../utils/Utils";
import Loader from "../../../../loader/Loader";
import {
  clearCtx as clearStaticDrawCtx,
  clearDynamicCtx as clearDynamicDrawCtx,
  drawStaticText,
  drawTarget,
  drawTreasureChest,
  drawTreasureCompleted,
  prepare,
} from "../process-helpers/DrawManager";
import { defineDrop, DropType } from "../process-helpers/Drop";
import { ImageType } from "../process-helpers/ImageLoader";
import QuestProcess, { QuestProcessProps, QuestProcessState } from "../QuestProcess";
import "./treasure-process.scss";

//TODO: Сделать открытие сундуков пинболом!

enum ProcessState {
  LOADING,
  CHOOSING,

  SMASHING,
  LOCKPICKING,

  DROPS,
  AFTERMATH,
}

const mandatoryImages = () => {
  return [ImageType.CHEST_CLOSED, ImageType.CHEST_OPENED, ImageType.RESULT_BACK, ImageType.RESULT_GOLD, ImageType.ENERGY_DROP];
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
          processState: ProcessState.CHOOSING,
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

    if (this.state.processState === ProcessState.SMASHING) {
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
          { x: this.canvasRef.current!.width * 0.5 - 25, y: this.canvasRef.current!.height * 0.5 - 100 } // 25 - half of gold img size
        );

        this.setState((state) => {
          return { drops: [...state.drops, drop] };
        });
      }

      if (this.dropsInitiated) {
        if (this.dropChunks.length === 0 && this.state.drops.filter((d) => !d.collected && !d.timeouted).length === 0) {
          this.props.setHeroRewards(this.calcHeroRewards());
          this.setState({ processState: ProcessState.AFTERMATH }, () => this.drawStatic());
        }
      }
    }

    this.drawFrame();
    this.updateCommon();
  }

  drawStatic() {
    clearStaticDrawCtx();

    if (this.state.processState === ProcessState.DROPS || this.state.processState === ProcessState.AFTERMATH) {
      drawTreasureCompleted(
        this.state.processState === ProcessState.AFTERMATH
          ? this.state.drops.filter((d) => d.type === DropType.GOLD && d.collected).reduce((a, b) => a + b.amount, 0)
          : undefined
      );
    }
    if (this.state.processState === ProcessState.SMASHING) {
      drawTarget(this.targetPos, 30);
    }

    if (
      this.state.processState === ProcessState.CHOOSING ||
      this.state.processState === ProcessState.SMASHING ||
      this.state.processState === ProcessState.LOCKPICKING
    ) {
      drawStaticText(
        this.state.processState === ProcessState.CHOOSING
          ? "Выбери как открыть сундук"
          : this.state.processState === ProcessState.SMASHING
          ? "забей сундук в цель"
          : "Вскрой замок отмычкой",
        { centerX: true, x: 0, y: 50 },
        32,
        "lightgreen"
      );
    }
  }

  drawFrame() {
    clearDynamicDrawCtx();
    drawTreasureChest(this.state.processState === ProcessState.DROPS || this.state.processState === ProcessState.AFTERMATH, this.chestPos);
    this.drawCommon();
    this.checkTreasureInTarget();
  }

  checkTreasureInTarget() {
    const chestPos = {
      x: this.dynamicCanvasRef.current!.width * 0.5 + this.chestPos.x,
      y: this.dynamicCanvasRef.current!.height + this.chestPos.y - 100,
    };

    if (distance(this.targetPos, chestPos) < 30) {
      this.chestPos.rotation = 0;
      this.chestPos.x = 0;
      this.chestPos.y = -200;

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

    this.dropChunks = [];

    console.log("-----");
    console.log(
      "before: ",
      this.dropChunks.reduce((a, b) => a + b.gold, 0)
    );

    for (;;) {
      let gold = Math.ceil(Math.random() * tribute * 0.1);

      if (total + gold > tribute) {
        gold = tribute - gold;
      }

      console.log(gold);

      time += (0.1 + Math.random() + 0.2) * 1000;
      this.dropChunks.push({ time, gold });
      total += gold;

      if (total >= tribute) {
        break;
      }
    }
    console.log(
      "after: ",
      this.dropChunks.reduce((a, b) => a + b.gold, 0)
    );

    this.dropsInitiated = true;
  }

  canvasClickHandler(e: MouseEvent) {
    e.stopPropagation();

    if (this.state.processState === ProcessState.SMASHING) {
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
    }

    if (this.state.processState === ProcessState.DROPS) {
      this.checkDropClicked(this.getClickPoint(e));
    }
  }

  completeCheckpointClickHandler(e: MouseEvent) {
    this.props.moveOnwards(this.collectedTreasureDrops());
  }

  collectedTreasureDrops() {
    return [
      {
        actorId: 0,
        drops: this.state.drops.filter((d) => d.type === DropType.GOLD && d.collected).map((d) => d.amount),
      },
    ];
  }

  childRender() {
    const { processState } = this.state;
    return (
      <>
        {processState === ProcessState.LOADING ? <Loader message="Loading assets" /> : null}
        {processState === ProcessState.CHOOSING ? (
          <div>
            <button
              className="treasure-process__btn-choosing treasure-process__btn-choosing--smashing"
              onClick={(e) => {
                this.setState({ processState: ProcessState.SMASHING }, () => this.drawStatic());
              }}
            ></button>
            <button
              className="treasure-process__btn-choosing treasure-process__btn-choosing--lockpicking"
              onClick={(e) => {
                this.setState({ processState: ProcessState.SMASHING }, () => this.drawStatic());
              }}
            ></button>
          </div>
        ) : null}
        {processState === ProcessState.AFTERMATH ? (
          <button className="quest-process__btn_onwards" onClick={(e) => this.completeCheckpointClickHandler(e)}>
            На карту локации
          </button>
        ) : null}
      </>
    );
  }
}

export default TreasureProcess;
