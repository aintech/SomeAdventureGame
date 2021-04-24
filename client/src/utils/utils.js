import { gameplayScale } from "./variables.js";

// const compose = (...funcs) => (comp) => {
//   return funcs.reduceRight((wrapped, f) => f(wrapped), comp);
// };

const padding = (num, places) => {
  return String(num).padStart(places, "0");
};

const convertDuration = (duration) => {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  return `${padding(min, 2)}:${padding(sec, 2)}`;
};

const toGameplayScale = (value) => {
  return value / gameplayScale;
};

export { convertDuration, toGameplayScale };
