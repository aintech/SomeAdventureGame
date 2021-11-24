import { Component, createRef, MouseEvent } from "react";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import { lerpXY, Position } from "../../../../utils/Utils";
import { rgba } from "./process-helpers/Color";
import { drawDrops, drawMessages } from "./process-helpers/DrawManager";
import { Drop, DropType } from "./process-helpers/Drop";
import { Direction, Effect, EventMessage } from "./process-helpers/EventMessage";
import "./quest-process.scss";

export type QuestProcessProps = {
  checkpoint: QuestCheckpoint;
  heroes: Hero[];
  closeCheckpoint: () => void;
  setHeroRewards: (rewards: Map<number, { gold: number; experience: number }>) => void;
};

export type QuestProcessState = {
  seconds: number;
  eventMessages: EventMessage[];
  beginTime?: Date;
  drops: Drop[];
};

class QuestProcess<P extends QuestProcessProps, S extends QuestProcessState> extends Component<P, S> {
  protected roundTimer?: NodeJS.Timeout;
  protected frameTimer?: NodeJS.Timeout;
  protected canvasRef: React.RefObject<HTMLCanvasElement>;
  protected dynamicCanvasRef: React.RefObject<HTMLCanvasElement>;

  protected background: string;

  constructor(props: P) {
    super(props);
    this.canvasRef = createRef();
    this.dynamicCanvasRef = createRef();
    this.background = "dungeon";
  }

  onUnmount() {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
    }
    if (this.frameTimer) {
      clearInterval(this.frameTimer);
    }
  }

  drawCommon() {
    drawDrops(this.state.drops.filter((d) => !d.stored && !d.timeouted));
    drawMessages(this.state.eventMessages);
  }

  updateCommon() {
    this.moveDrops();
    this.checkEndedMessages();
    this.checkTimeoutedDrops();
  }

  moveDrops() {
    this.state.drops
      .filter((d) => !d.stored && !d.timeouted)
      .forEach((drop) => {
        if (!drop.collected) {
          if (drop.position.y < this.dynamicCanvasRef.current!.height - drop.dimensions.height) {
            drop.position = { x: drop.position.x + drop.acceleration.x, y: drop.position.y + drop.acceleration.y };
            drop.acceleration.x = lerpXY(drop.acceleration.x, 0, 0.1);
            drop.acceleration.y = lerpXY(drop.acceleration.y, 10, 0.1);

            // bouncing from side wall
            if (drop.position.x < 0 || drop.position.x > this.dynamicCanvasRef.current!.width - drop.dimensions.width) {
              drop.acceleration.x *= -1;
            }

            // stop on floor
            if (drop.position.y > this.dynamicCanvasRef.current!.height - drop.dimensions.height) {
              drop.position.y = this.dynamicCanvasRef.current!.height - drop.dimensions.height;
              drop.acceleration = { x: 0, y: 0 };
            }
          }
        } else {
          if (drop.position.x > 0) {
            drop.position = { x: drop.position.x + drop.acceleration.x, y: drop.position.y + drop.acceleration.y };
            drop.acceleration.x = lerpXY(drop.acceleration.x, -drop.position.x * 0.05, 0.1);
            drop.acceleration.y = lerpXY(drop.acceleration.y, -drop.position.y * 0.05, 0.1);
          } else {
            drop.stored = true;
          }
        }
      });
  }

  getMousePoint(e: MouseEvent) {
    const rect = this.dynamicCanvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  checkDropClicked(click: Position) {
    const { drops } = this.state;

    let msg: EventMessage | undefined = undefined;
    for (let i = drops.length - 1; i >= 0; i--) {
      const drop = drops[i];
      if (!drop.collected && !drop.timeouted) {
        if (this.dropUnderMouse(click, drop)) {
          drop.collected = true;
          msg = new EventMessage(
            1,
            click,
            32,
            `+ ${drop.amount}c`,
            rgba(230, 230, 255),
            Math.random() < 0.5 ? Direction.RIGHT : Direction.LEFT,
            Effect.FLY_AWAY
          );
          break;
        }
      }
    }

    if (msg) {
      this.setState((state) => {
        return { drops, eventMessages: [...state.eventMessages, msg!] };
      });
      return true;
    }

    return false;
  }

  dropUnderMouse(point: Position, drop: Drop) {
    return (
      drop.position.x <= point.x &&
      drop.position.x + drop.dimensions.width >= point.x &&
      drop.position.y - Math.max(0, drop.acceleration.y * 5) <= point.y &&
      drop.position.y + drop.dimensions.height >= point.y
    );
  }

  checkEndedMessages() {
    const endedMessages = this.state.eventMessages.filter((m) => m.fireTime().getTime() + m.lifetime * 1000 < new Date().getTime());

    if (endedMessages.length > 0) {
      const filteredMessages = this.state.eventMessages;
      for (let i = 0; i < endedMessages.length; i++) {
        const idx = filteredMessages.findIndex((m) => m.id() === endedMessages[i].id());
        filteredMessages.splice(idx, 1);
      }
      this.setState({ eventMessages: filteredMessages });
    }
  }

  checkTimeoutedDrops() {
    const { drops } = this.state;
    const time = new Date().getTime();

    drops.forEach((d) => {
      if (!d.collected && !d.timeouted && d.lifeTill < time) {
        d.timeouted = true;
      }
    });

    this.setState({ drops });
  }

  calcHeroRewards(withTribute?: boolean) {
    const rewards = new Map<number, { gold: number; experience: number }>();

    const { checkpoint } = this.props;
    const { heroes } = this.props;
    const { drops } = this.state;

    let experience = 0;
    if (checkpoint.enemies) {
      experience = Math.ceil(checkpoint.enemies.reduce((a, b) => a + b.experience, 0) / heroes.length);
    }

    let gold = 0;
    const collectedGold = drops.filter((d) => d.type === DropType.GOLD && d.collected).reduce((a, b) => a + b.amount, 0);

    gold = Math.ceil((collectedGold + (withTribute ? checkpoint.tribute : 0)) / heroes.length);

    heroes.forEach((h) => rewards.set(h.id, { gold, experience }));

    return rewards;
  }

  canvasClickHandler(e: MouseEvent) {}

  canvasMouseMoveHandler(e: MouseEvent) {
    const point = this.getMousePoint(e);
    this.state.drops
      .filter((d) => !d.collected && !d.timeouted)
      .forEach((d) => {
        if (this.dropUnderMouse(point, d)) {
          d.collected = true;
        }
      });
  }

  childRender() {
    return <div>Override child render in subclass!</div>;
  }

  render() {
    return (
      <>
        <div className={`quest-process__canvas quest-process__back_${this.background}`}>
          <canvas className="quest-process__canvas-static" width={698} height={558} ref={this.canvasRef}></canvas>
          <canvas
            className="quest-process__canvas-dynamic"
            width={698}
            height={558}
            ref={this.dynamicCanvasRef}
            onClick={(e) => this.canvasClickHandler(e)}
            onMouseMove={(e) => this.canvasMouseMoveHandler(e)}
          ></canvas>
          {this.childRender()}
        </div>
      </>
    );
  }
}

export default QuestProcess;
