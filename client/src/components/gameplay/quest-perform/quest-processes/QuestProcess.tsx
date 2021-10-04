import { Component, createRef, MouseEvent } from "react";
import Hero from "../../../../models/hero/Hero";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import { lerpXY, Position } from "../../../../utils/Utils";
import { create } from "./process-helpers/Color";
import { drawDrops, drawMessages } from "./process-helpers/DrawManager";
import { Drop, DropType } from "./process-helpers/Drop";
import { Direction, Effect, EventMessage } from "./process-helpers/EventMessage";

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

  constructor(props: P) {
    super(props);
    this.canvasRef = createRef();
    this.dynamicCanvasRef = createRef();
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
    drawDrops(this.state.drops.filter((d) => !d.collected && !d.timeouted));
    drawMessages(this.state.eventMessages);
  }

  updateCommon() {
    this.moveDrops();
    this.checkEndedMessages();
    this.checkTimeoutedDrops();
  }

  moveDrops() {
    this.state.drops
      .filter((d) => !d.collected && !d.timeouted)
      .forEach((drop) => {
        if (drop.position.y < this.dynamicCanvasRef.current!.height - 50) {
          drop.position = { x: drop.position.x + drop.acceleration.x, y: drop.position.y + drop.acceleration.y };
          drop.acceleration.x = lerpXY(drop.acceleration.x, 0, 0.1);
          drop.acceleration.y = lerpXY(drop.acceleration.y, 10, 0.1);

          // bouncing from side wall
          if (drop.position.x < 0 || drop.position.x > this.dynamicCanvasRef.current!.width - 50) {
            drop.acceleration.x *= -1;
          }

          // stop on floor
          if (drop.position.y >= this.dynamicCanvasRef.current!.height - 50) {
            drop.position.y = this.dynamicCanvasRef.current!.height - 50;
            drop.acceleration = { x: 0, y: 0 };
          }
        }
      });
  }

  getClickPoint(e: MouseEvent) {
    const rect = this.dynamicCanvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  checkDropClicked(click: Position) {
    const { drops } = this.state;

    let msg: EventMessage | undefined = undefined;
    for (let i = drops.length - 1; i >= 0; i--) {
      const drop = drops[i];
      if (!drop.collected && !drop.timeouted) {
        if (
          drop.position.x <= click.x &&
          drop.position.x + drop.dimensions.width >= click.x &&
          drop.position.y - Math.max(0, drop.acceleration.y * 5) <= click.y &&
          drop.position.y + drop.dimensions.height >= click.y
        ) {
          drop.collected = true;
          msg = new EventMessage(
            1,
            click,
            32,
            `+ ${drop.amount} g`,
            create(255, 255),
            Direction.RIGHT,
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
    const collectedGold = drops
      .filter((d) => d.type === DropType.GOLD && d.collected)
      .reduce((a, b) => a + b.amount, 0);

    gold = Math.ceil((collectedGold + (withTribute ? checkpoint.tribute : 0)) / heroes.length);

    heroes.forEach((h) => rewards.set(h.id, { gold, experience }));

    return rewards;
  }
}

export default QuestProcess;
