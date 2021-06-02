import { gameplayScale } from "./variables";

const padding = (num: number, places: number): string => {
  return String(num).padStart(places, "0");
};

const convertDuration = (duration: number) => {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  return `${padding(min, 2)}:${padding(sec, 2)}`;
};

const toGameplayScale = (value: number) => {
  return value / gameplayScale;
};

const millisToSecs = (milliseconds: number) => {
  return Math.floor(milliseconds * 0.001);
};

const dateToSecs = (date: Date) => {
  return millisToSecs(date.getTime());
};

export { convertDuration, toGameplayScale, millisToSecs, dateToSecs };
