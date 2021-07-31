import { anyOf } from "../utils/Arrays";

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

export type GeneratedHero = {
  name: string;
  type: string;
  power: number;
  defence: number;
  vitality: number;
  initiative: number;
  health: number;
  experience: number;
  gold: number;
  index: number;
};

const generateHeroes = () => {
  const heroes: GeneratedHero[] = [];
  const poolSize = 6; //Math.floor(Math.random() * 7) + 3;
  for (let i = 0; i < poolSize; i++) {
    heroes.push({
      name: anyOf(names),
      type: Math.random() > 0.5 ? "warrior" : "mage",
      power: 10,
      defence: 3,
      vitality: 10,
      initiative: 2,
      health: 100,
      experience: 50,
      gold: 100,
      index: i,
    });
  }

  return heroes;
};

export default generateHeroes;