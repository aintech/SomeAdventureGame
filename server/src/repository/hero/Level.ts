import query from "../Db";
import { Hero } from "./Hero";

export type LevelExp = {
  level: number;
  experience: number;
  cost: number;
};

export type HeroLevel = { lvl: number; progress: number; levelUp: boolean; cost: number };

let maxLevel = 0;
const levels: LevelExp[] = [];
const fetchLevels = () => {
  return query<LevelExp[]>("fetchLevels", "select * from public.level_exp", [], mapLevel);
};

const checkLevelsLoaded = async () => {
  if (levels.length === 0) {
    const lvls = await fetchLevels();
    if (levels.length === 0) {
      levels.push(...lvls);
      maxLevel = Math.max(...levels.map((l) => l.level));
    }
  }
};

const calcLevelProgress = (hero: Hero): HeroLevel => {
  if (hero.level.lvl === maxLevel) {
    return {
      lvl: maxLevel,
      progress: 0,
      levelUp: false,
      cost: 0,
    };
  }
  const currentLevelExp = levels.filter((l) => l.level === hero.level.lvl)[0];
  const nextLevelExp = levels.filter((l) => l.level === hero.level.lvl + 1)[0];
  if (!currentLevelExp) {
    throw new Error(`No level info ${hero}`);
  }

  const nextToCurrDiff = nextLevelExp.experience - currentLevelExp.experience;
  const heroToCurrDiff = hero.experience - currentLevelExp.experience;
  const progress = heroToCurrDiff / nextToCurrDiff;

  const levelUp = hero.experience > nextLevelExp.experience;
  const cost = levelUp ? nextLevelExp.cost : 0;

  return {
    lvl: hero.level.lvl,
    progress,
    levelUp,
    cost,
  };
};

export const withLevelUpInfo = async (heroes: Hero[]) => {
  await checkLevelsLoaded();
  if (heroes.length === 0) {
    return [];
  }
  return heroes.map((h) => {
    return { ...h, level: calcLevelProgress(h) };
  });
};

type LevelRow = {
  level: string;
  experience: string;
  cost: string;
};

const mapLevel = (row: LevelRow): LevelExp => {
  return {
    level: +row.level,
    experience: +row.experience,
    cost: +row.cost,
  };
};
