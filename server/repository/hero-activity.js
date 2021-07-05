import { HEALTH_PER_VITALITY } from "../../client/src/utils/variables.js";
import query from "./db.js";
import { adjustHeroGold, adjustHeroHealth, getHeroesByIds } from "./hero.js";
import { addStatsGold } from "./stats.js";

const updateHeroActivities = async (userId, heroActivities) => {
  const heroIds = heroActivities.map((a) => a.heroId);
  const heroes = await getHeroesByIds(heroIds);

  for (const heroActivity of heroActivities) {
    const hero = heroes.filter((h) => +h.id === +heroActivity.heroId)[0];
    switch (heroActivity.type) {
      case "idle":
        if (hero.activity_type === "healer") {
          //adding max health
          await adjustHeroHealth(hero.id, +hero.vitality * HEALTH_PER_VITALITY);
        }
        break;
      case "quest":
        //all done in complete quest methods
        break;
      case "healer":
        const healthDiff = +hero.vitality * HEALTH_PER_VITALITY - +hero.health;
        heroActivity.duration = healthDiff * 60;
        await Promise.all([
          adjustHeroGold(hero.id, -healthDiff),
          addStatsGold(userId, healthDiff),
        ]);
        break;
      default:
        throw new Error(`Unknown activity type - ${type}`);
    }
    await updateHeroActivity(hero.id, heroActivity);
  }

  return getHeroesByIds(heroIds);
};

const updateHeroActivity = async (heroId, activity) => {
  await query(
    "updateHeroActivity",
    `update public.hero_activity set 
      activity_type = '${activity.type}', 
      activity_id = ${activity.activity_id ?? null}, 
      duration = ${activity.duration ?? null},
      started_at = now() 
     where hero_id = $1`,
    [heroId]
  );
};

export { updateHeroActivities };
