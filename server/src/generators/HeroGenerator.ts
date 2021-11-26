import { HeroType } from "../repository/hero/Hero";
import { anyOf } from "../utils/Arrays";

const names = [
  "Аркада",
  "Мира",
  "Полана",
  "Остера",
  "Саргона",
  "Клевер",
  "Плея",
  "Сарина",
  "Патока",
  "Каппи",
  "Олива",
  "Троя",
  "Луна",
  "Тэрра",
  "Цветик",
  "Белянка",
  "Март",
  "Сола",
  "Капля",
];

export type GeneratedHero = {
  name: string;
  type: HeroType;
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
  const poolSize = Math.floor(Math.random() * 4) + 10;
  for (let i = 0; i < poolSize; i++) {
    const power = Math.floor(Math.random() * 6) + 5;
    const vit = Math.floor(Math.random() * 5) + 10;
    heroes.push({
      name: anyOf(names),
      type: randomType(),
      power: power,
      defence: 0,
      vitality: vit,
      initiative: 2,
      health: vit * 10,
      experience: 0,
      gold: power * 10 + vit * 10,
      index: i,
    });
  }

  return heroes;
};

const randomType = (): HeroType => {
  return Math.floor(Math.random() * Object.values(HeroType).length * 0.5);
};

export default generateHeroes;
