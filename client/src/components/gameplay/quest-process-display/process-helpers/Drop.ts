import { EnemyDrop } from "../../../../models/QuestCheckpoint";
import { Dimensions, Position } from "../../../../utils/Utils";
import { Direction } from "./EventMessage";

export enum DropType {
  GOLD,
}

export type Drop = {
  type: DropType;
  amount: number;
  position: Position;
  target: Position;
  dimensions: Dimensions;
  direction: { x: Direction; y: Direction };

  lifeTill: number; // in ms
  blinkCtr: number;

  collected?: boolean;
  timeouted?: boolean;
};

export const defineDrop = (template: EnemyDrop, canvas: HTMLCanvasElement): Drop => {
  const position = {
    x: canvas.width * 0.5 + Math.random() * 30 * (Math.random() < 0.5 ? 1 : -1),
    y: canvas.height * 0.5 + Math.random() * canvas.height * 0.2 * (Math.random() < 0.5 ? 1 : -1),
  };

  const xOffset = (Math.random() * 200 + 100) * (position.x > canvas.width * 0.5 ? 1 : -1);
  const yOffset = (Math.random() * 100 + 100) * (position.y > canvas.height * 0.5 ? 1 : -1);

  const target = {
    x: Math.max(100, Math.min(canvas.width - 100, position.x + xOffset)),
    y: Math.max(100, Math.min(canvas.height - 100, position.y + yOffset)),
  };

  const direction = {
    x: position.x > target.x ? Direction.LEFT : Direction.RIGHT,
    y: position.y > target.y ? Direction.UP : Direction.DOWN,
  };

  return {
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
