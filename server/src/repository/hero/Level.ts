import query, { single } from "../Db";
import { Hero } from "./Hero";

export type LevelExp = {
  level: number;
  experience: number;
  cost: number;
  duration: number;
  definition: string;
};

export type LevelUp = {
  cost: number;
  duration: number;
};

export type HeroLevel = {
  lvl: number;
  experience: number;
  definition?: string;
  progress?: number;
  levelUp?: LevelUp;
};

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

export const getLevelExp = (level: number) => {
  return levels.filter((l) => l.level === level)[0];
};

const calcLevelProgress = (hero: Hero): HeroLevel => {
  if (hero.level.lvl === maxLevel) {
    hero.level;
  }
  const currentLevelExp = levels.filter((l) => l.level === hero.level.lvl)[0];
  const nextLevelExp = levels.filter((l) => l.level === hero.level.lvl + 1)[0];
  if (!currentLevelExp) {
    throw new Error(`No level info ${hero}`);
  }

  const nextToCurrDiff = nextLevelExp.experience - currentLevelExp.experience;
  const heroToCurrDiff = hero.level.experience - currentLevelExp.experience;
  const progress = heroToCurrDiff / nextToCurrDiff;

  const levelUp = hero.level.experience > nextLevelExp.experience;

  return {
    ...hero.level,
    definition: currentLevelExp.definition,
    progress,
    levelUp: levelUp
      ? {
          ...nextLevelExp,
        }
      : undefined,
  };
};

export const withLevelInfo = async (heroes: Hero[]) => {
  await checkLevelsLoaded();
  if (heroes.length === 0) {
    return [];
  }
  return heroes.map((h) => {
    return { ...h, level: calcLevelProgress(h) };
  });
};

export const getHeroLevel = (heroId: number) => {
  return query<number>("getHeroLevel", "select level from public.hero where id = $1", [heroId], single);
};

type LevelRow = {
  level: string;
  experience: string;
  cost: string;
  duration: string;
  definition: string;
};

const mapLevel = (row: LevelRow): LevelExp => {
  return {
    level: +row.level,
    experience: +row.experience,
    cost: +row.cost,
    duration: +row.duration,
    definition: row.definition,
  };
};
