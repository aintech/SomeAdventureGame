import { CURE_COST_PER_HP, HEALTH_PER_VITALITY } from "../utils/Variables";
import query from "./Db";
import { adjustHeroGold, adjustHeroHealth, getHeroesByIds } from "./Hero";
import { addStats } from "./Stats";

export enum HeroActivityType {
  IDLE,
  QUEST,
  HEALER,
}

type HeroActivity = {
  heroId: number;
  type: HeroActivityType;
  activity_id: number | null;
  duration: number | null;
};

const updateHeroActivities = async (userId: number, heroActivities: HeroActivity[]) => {
  const heroIds = heroActivities.map((a) => a.heroId);
  const heroes = await getHeroesByIds(heroIds);

  for (const heroActivity of heroActivities) {
    const hero = heroes.filter((h) => +h.id === +heroActivity.heroId)[0];
    switch (heroActivity.type) {
      case HeroActivityType.IDLE:
        if (hero.activity_type === HeroActivityType.HEALER) {
          //adding max health
          await adjustHeroHealth(hero.id, +hero.vitality * HEALTH_PER_VITALITY);
        }
        break;
      case HeroActivityType.QUEST:
        //all done in complete quest methods
        break;
      case HeroActivityType.HEALER:
        const hpLoss = +hero.vitality * HEALTH_PER_VITALITY - +hero.health;
        heroActivity.duration = hpLoss * 5;
        await Promise.all([
          adjustHeroGold(hero.id, -hpLoss * CURE_COST_PER_HP),
          addStats(userId, hpLoss * CURE_COST_PER_HP),
        ]);
        break;
      default:
        throw new Error(`Unknown activity type - ${heroActivity.type}`);
    }
    await updateHeroActivity(hero.id, heroActivity);
  }

  return getHeroesByIds(heroIds);
};

const updateHeroActivity = async (heroId: number, activity: HeroActivity) => {
  await query<void>(
    "updateHeroActivity",
    `update public.hero_activity set 
      activity_type = '${HeroActivityType[activity.type].toLowerCase()}', 
      activity_id = ${activity.activity_id ?? null}, 
      duration = ${activity.duration ?? null},
      started_at = now() 
     where hero_id = $1`,
    [heroId]
  );
};

export { updateHeroActivities };
