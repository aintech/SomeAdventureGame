import query from "../Db";
import { Hero, HeroWithLevelProgress, HeroWithLevelUp } from "./Hero";

export type Level = {
  level: number;
  experience: number;
};

let maxLevel = 0;
const levels: Level[] = [];
const fetchLevels = () => {
  return query<Level[]>("fetchLevels", "select * from public.level_exp", [], mapLevel);
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

const calcHeroLevel = (hero: Hero) => {
  return Math.max(...levels.filter((l) => l.experience < hero.experience).map((l) => l.level));
};

const calcLevelProgress = (hero: HeroWithLevelUp) => {
  const prevLvlExp = levels.filter((l) => l.level === hero.level)[0];
  if (!prevLvlExp) {
    console.log(hero);
  }
  const nextLvlExp =
    hero.level === maxLevel ? Number.MAX_SAFE_INTEGER : levels.filter((l) => l.level === hero.level + 1)[0].experience;

  const lvlsScope = nextLvlExp - prevLvlExp.experience;
  const heroScope = hero.experience - prevLvlExp.experience;
  return heroScope / lvlsScope;
};

export const withLevelUpInfo = async (heroes: Hero[]) => {
  await checkLevelsLoaded();
  if (heroes.length === 0) {
    return [];
  }
  return heroes
    .map((h) => {
      return { ...h, levelUp: calcHeroLevel(h) > h.level } as HeroWithLevelUp;
    })
    .map((h) => {
      return { ...h, progress: calcLevelProgress(h) } as HeroWithLevelProgress;
    });
};

type LevelRow = {
  level: string;
  experience: string;
};

const mapLevel = (row: LevelRow): Level => {
  return {
    level: +row.level,
    experience: +row.experience,
  };
};
