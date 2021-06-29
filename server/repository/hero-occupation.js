import { HEALTH_PER_VITALITY } from "../../client/src/utils/variables.js";
import query from "./db.js";
import { getHeroesByIds } from "./hero.js";

const updateHeroOccupations = async (occupations) => {
  const preparedOccupations = await prepareHeroesOccupation(occupations);
  let sql = `
      update public.hero_occupation ho
      set 
        occupation_type = o.type, 
        occupation_id = o.occupation_id, 
        started_at = now(), 
        duration = o.duration
      from (values `;

  const values = [];
  preparedOccupations.forEach((occupation) => {
    const o = occupation.occupation;
    values.push(`
      (
        ${occupation.hero_id},
        '${o.type}',
        ${o.occupation_id ?? null}::integer,
        ${o.duration ?? null}::integer
      )
    `);
  });
  sql += `
    ${values.join(",")}
    )  as o(hero_id, type, occupation_id, duration)
    where ho.hero_id = o.hero_id`;

  await query("updateHeroOccupation", sql);

  const heroIds = occupations.map((o) => o.heroId);
  return getHeroesByIds(heroIds);
};

const prepareHeroesOccupation = async (occupations) => {
  const preparedOccupations = [];

  const heroIds = occupations.map((o) => o.heroId);
  const heroes = await getHeroesByIds(heroIds);
  for (const hero of heroes) {
    const type = occupations.filter((o) => o.heroId === +hero.id)[0].type;
    let occupation = { type };
    switch (type) {
      case "healer":
        occupation.duration =
          +hero.vitality * HEALTH_PER_VITALITY - +hero.health;
        break;
      default:
        throw new Error(`Unknown occupation type - ${type}`);
    }
    preparedOccupations.push({
      hero_id: hero.id,
      occupation,
    });
  }

  return preparedOccupations;
};

export { updateHeroOccupations };
