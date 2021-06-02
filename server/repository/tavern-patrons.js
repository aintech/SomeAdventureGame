import generateName from "../../shared/utils/hero-names-generator.js";
import query from "./db.js";
import { getNotHiredHeroes } from "./hero.js";

const getTavernPatrons = async (userId) => {
  let patrons = await getNotHiredHeroes(userId);
  if (isItTimeToReplenishPatrons(patrons)) {
    if (patrons.length > 0) {
      await seeingOffPatrons(patrons.map((h) => h.id));
    }
    await letInHeroes(userId);
    patrons = await getNotHiredHeroes(userId);
  }
  return patrons;
};

const isItTimeToReplenishPatrons = (heroes) => {
  const dayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  return heroes.length === 0 || heroes.some((h) => h.appear_at < dayAgo);
};

const seeingOffPatrons = async (heroIds) => {
  const ids = heroIds.join(",");
  return Promise.all([
    query(
      "seeingOffPatrons - equip",
      `delete from public.hero_equipment where hero_id in (${ids})`
    ),
    query(
      "seeingOffPatrons - heroes",
      `delete from public.hero where id in (${ids})`
    ),
  ]);
};

const letInHeroes = async (userId) => {
  const heroes = [];
  const poolSize = 6; //Math.floor(Math.random() * 7) + 3;
  for (let i = 0; i < poolSize; i++) {
    heroes.push({
      name: generateName(),
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

  await persistPastrons(userId, heroes);

  const newlyArrived = await getNotHiredHeroes(userId);

  await givePatronsEqipment(newlyArrived);
};

const persistPastrons = async (userId, heroes) => {
  const heroesData = heroes
    .map(
      (hero) =>
        `select 
            ${userId}, '${hero.name}', '${hero.type}', 
            ${hero.power}, ${hero.defence}, ${hero.vitality}, ${hero.initiative},
            ${hero.health}, ${hero.experience}, ${hero.gold}, 
            (now() + interval '${hero.index} seconds')`
    )
    .join(" union ");

  return query(
    "persistPastrons",
    `insert into public.hero 
       (user_id, name, type, power, defence, vitality, initiative, 
        health, experience, gold, appear_at)
       select * from (${heroesData}) as vals`
  );
};

const givePatronsEqipment = async (heroes) => {
  const defaultArmor = heroes
    .map((hero) => `select ${hero.id}, 3`)
    .join(" union ");

  const defaultWeapon = heroes
    .map((hero) => `select ${hero.id}, ${hero.type === "mage" ? 2 : 1}`)
    .join(" union ");

  return query(
    "givePatronsEqipment",
    `insert into public.hero_equipment (hero_id, equipment_id)
     select * from (${defaultArmor} union ${defaultWeapon}) as vals;`
  );
};

export { getTavernPatrons };
