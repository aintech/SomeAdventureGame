import { anyOf } from "./arrays.js";

const names = [
  "Потер",
  "Калопус",
  "Мира",
  "Серпок",
  "Белозер",
  "Тетера",
  "Солнцехват",
  "Политра",
  "Карион",
  "Всевол",
  "Торий",
  "Мосток",
  "Клайн",
  "Ровер",
];

const generateName = () => {
  return anyOf(names);
};

export default generateName;
