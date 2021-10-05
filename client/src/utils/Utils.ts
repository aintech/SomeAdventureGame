import { gameplayScale } from "./Variables";

export type Position = {
  x: number;
  y: number;
};

export type CenteredPosition = Position & {
  centerX?: boolean;
  centerY?: boolean;
};

export type Dimensions = {
  width: number;
  height: number;
};

const padding = (num: number, places: number): string => {
  return String(num).padStart(places, "0");
};

export const convertDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds / 60 - hrs * 60);
  const secs = Math.floor(seconds - mins * 60 - hrs * 3600);
  return `${hrs > 0 ? padding(hrs, 2) + ":" : ""}${padding(mins, 2)}:${padding(secs, 2)}`;
};

export const toGameplayScale = (value: number) => {
  return value / gameplayScale;
};

export const millisToSecs = (milliseconds: number) => {
  return Math.floor(milliseconds * 0.001);
};

export const dateToSecs = (date: Date) => {
  return millisToSecs(date.getTime());
};

export const distance = (a: Position, b: Position) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

export const lerp = (from: Position, to: Position, speed: number) => {
  return { x: lerpXY(from.x, to.x, speed), y: lerpXY(from.y, to.y, speed) };
};

export const lerpXY = (x: number, y: number, speed: number) => {
  return (1 - speed) * x + speed * y;
};

export const clickInBox = (click: Position, box: { center: Position; edgeHalf: number }) => {
  return (
    box.center.x - box.edgeHalf < click.x &&
    box.center.x + box.edgeHalf > click.x &&
    box.center.y - box.edgeHalf < click.y &&
    box.center.y + box.edgeHalf > click.y
  );
};

export const shallowCopy = <T>(original: T): T => {
  return JSON.parse(JSON.stringify(original));
};
