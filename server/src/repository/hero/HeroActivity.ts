import { CURE_COST_PER_HP, HEALTH_PER_VITALITY } from "../../utils/Variables";
import query from "../Db";
import {
  adjustHeroGold,
  adjustHeroHealth,
  getHeroesByIds,
  HeroType,
  HeroWithPerks,
  updateHeroLevel,
} from "../hero/Hero";
import { addStats } from "../Stats";
import { getHeroLevel, getLevelExp } from "./Level";

export enum HeroActivityType {
  IDLE,
  QUEST,
  HEALING,
  TRAINING,
  PURCHASING,
  PRAYING,
}

export type HeroActivity = {
  heroId: number;
  type: HeroActivityType;
  activityId?: number;
  duration?: number;
};

export const updateHeroActivities = async (userId: number, heroActivities: HeroActivity[]) => {
  const heroIds = heroActivities.map((a) => a.heroId);
  const heroes = await getHeroesByIds(heroIds);

  for (const heroActivity of heroActivities) {
    const hero = heroes.filter((h) => +h.id === +heroActivity.heroId)[0];
    switch (heroActivity.type) {
      case HeroActivityType.IDLE:
        toIdle(hero);
        break;
      case HeroActivityType.QUEST:
        //all done in embark to quest methods
        break;
      case HeroActivityType.HEALING:
        idleToHealing(userId, hero, heroActivity);
        break;
      case HeroActivityType.TRAINING:
        idleToTraining(userId, hero, heroActivity);
        break;
      default:
        throw new Error(`Unknown activity type - ${heroActivity.type}`);
    }
    await updateHeroActivity(hero.id, heroActivity);
  }

  return getHeroesByIds(heroIds);
};

//FIXME: Проверять что прошло время нужное на завершение квеста
const toIdle = async (hero: HeroWithPerks) => {
  switch (hero.activityType) {
    case HeroActivityType.QUEST:
      //all done in complete quest methods
      break;
    case HeroActivityType.HEALING:
      //adding max health
      await adjustHeroHealth(hero.id, Number.MAX_SAFE_INTEGER);
      break;
    case HeroActivityType.TRAINING:
      const power = Math.floor(Math.random() * 6) + 5;
      const vitality = Math.floor(Math.random() * (hero.type === HeroType.MAGE || HeroType.HEALER ? 2 : 6)) + 3;
      await updateHeroLevel(hero.id, hero.level.lvl + 1, power, vitality);
      await adjustHeroHealth(hero.id, Number.MAX_SAFE_INTEGER);
      break;
    default:
      throw new Error(`Unknown activity type ${hero.activityType}`);
  }
};

const idleToHealing = async (userId: number, hero: HeroWithPerks, heroActivity: HeroActivity) => {
  const hpLoss = hero.vitality * HEALTH_PER_VITALITY - hero.health;
  const cost = hpLoss * CURE_COST_PER_HP;

  if (cost > hero.gold) {
    throw new Error(`Not enought gold for healing!`);
  }

  heroActivity.duration = hpLoss * 5;
  await Promise.all([adjustHeroGold(hero.id, -cost), addStats(userId, cost)]);
};

const idleToTraining = async (userId: number, hero: HeroWithPerks, heroActivity: HeroActivity) => {
  const nextLevel = getLevelExp(hero.level.lvl + 1);

  if (nextLevel.cost > hero.gold) {
    throw new Error(`Not enought gold for level up!`);
  }
  if (hero.level.experience < nextLevel.experience) {
    throw new ErrorEvent(`Not enought experience for level up!`);
  }

  heroActivity.duration = nextLevel.duration;
  await Promise.all([adjustHeroGold(hero.id, -nextLevel.cost), addStats(userId, nextLevel.cost)]);
};

const updateHeroActivity = async (heroId: number, activity: HeroActivity) => {
  await query<void>(
    "updateHeroActivity",
    `update public.hero_activity set 
     activity_type = ${activity.type}, 
     activity_id = ${activity.activityId ?? null}, 
     duration = ${activity.duration ?? null},
     started_at = now() 
     where hero_id = $1`,
    [heroId]
  );
};
