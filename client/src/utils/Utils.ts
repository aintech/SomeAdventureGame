import { gameplayScale } from "./variables";

const padding = (num: number, places: number): string => {
  return String(num).padStart(places, "0");
};

const convertDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds / 60 - hrs * 60);
  const secs = Math.floor(seconds - mins * 60 - hrs * 3600);
  return `${hrs > 0 ? padding(hrs, 2) + ":" : ""}${padding(mins, 2)}:${padding(secs, 2)}`;
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
