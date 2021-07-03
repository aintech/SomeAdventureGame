import { HEALTH_PER_VITALITY } from "../../client/src/utils/variables.js";
import query from "./db.js";
import { getHeroesByIds } from "./hero.js";

const updateHeroActivities = async (heroActivities) => {
  const enrichedActivities = await enrichHeroActivities(heroActivities);
  let sql = `
      update public.hero_activity ho
      set 
        activity_type = o.type, 
        activity_id = o.activity_id, 
        started_at = now(), 
        duration = o.duration
      from (values `;

  const values = [];
  enrichedActivities.forEach((activity) => {
    const act = activity.activity;
    values.push(`
      (
        ${activity.hero_id},
        '${act.type}',
        ${act.activity_id ?? null}::integer,
        ${act.duration ?? null}::integer
      )
    `);
  });
  sql += `
    ${values.join(",")}
    )  as o(hero_id, type, activity_id, duration)
    where ho.hero_id = o.hero_id`;

  await query("updateHeroActivity", sql);

  const heroIds = heroActivities.map((o) => o.heroId);
  return getHeroesByIds(heroIds);
};

const enrichHeroActivities = async (activities) => {
  const enrichedActivities = [];

  const heroIds = activities.map((o) => o.heroId);
  const heroes = await getHeroesByIds(heroIds);
  for (const hero of heroes) {
    const activity = activities.filter((o) => o.heroId === +hero.id)[0];
    switch (activity.type) {
      case "idle":
        break;
      case "quest":
        break;
      case "healer":
        activity.duration = +hero.vitality * HEALTH_PER_VITALITY - +hero.health;
        break;
      default:
        throw new Error(`Unknown activity type - ${type}`);
    }
    enrichedActivities.push({
      hero_id: hero.id,
      activity,
    });
  }

  return enrichedActivities;
};

export { updateHeroActivities };
