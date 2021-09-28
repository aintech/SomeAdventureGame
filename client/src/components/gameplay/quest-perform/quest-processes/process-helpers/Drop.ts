import { EnemyDrop } from "../../../../../models/QuestCheckpoint";
import { Dimensions, Position } from "../../../../../utils/Utils";
import { Direction } from "./EventMessage";

export enum DropType {
  GOLD,
}

export type Drop = {
  type: DropType;
  amount: number;

  actorId?: number;
  appearAt?: number;

  position: Position;
  target: Position;
  dimensions: Dimensions;
  direction: { x: Direction; y: Direction };

  lifeTill: number; // in ms
  blinkCtr: number;

  collected?: boolean;
  timeouted?: boolean;
};

export const defineDrop = (template: EnemyDrop, canvasDims: Dimensions, actorId?: number, initial?: Position): Drop => {
  const position = initial
    ? initial
    : {
        x: canvasDims.width * 0.5 + Math.random() * 30 * (Math.random() < 0.5 ? 1 : -1),
        y: canvasDims.height * 0.5 + Math.random() * canvasDims.height * 0.2 * (Math.random() < 0.5 ? 1 : -1),
      };

  const xOffset = (Math.random() * 200 + 100) * (position.x > canvasDims.width * 0.5 ? 1 : -1);
  const yOffset = (Math.random() * 100 + 100) * (position.y > canvasDims.height * 0.5 ? 1 : -1);

  const target = {
    x: Math.max(100, Math.min(canvasDims.width - 100, position.x + xOffset)),
    y: Math.max(100, Math.min(canvasDims.height - 100, position.y + yOffset)),
  };

  const direction = {
    x: position.x > target.x ? Direction.LEFT : Direction.RIGHT,
    y: position.y > target.y ? Direction.UP : Direction.DOWN,
  };

  return {
    actorId,
    appearAt: template.fraction,
    type: DropType.GOLD,
    amount: template.gold,
    position,
    target,
    direction,
    dimensions: { width: 50, height: 50 },
    lifeTill: new Date().getTime() + 10000,
    blinkCtr: 0,
  };
};
