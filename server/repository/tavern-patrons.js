import generateName from "../../shared/utils/hero-names-generator.js";
import { getNotHiredHeroes } from "./hero.js";
import usePool from "./use-pool.js";

const getTavernPatrons = async (userId) => {
  let heroes = await getNotHiredHeroes(userId);
  if (isItTimeToReplenishHeroes(heroes)) {
    if (heroes.length > 0) {
      await seeingOffHeroes(heroes.map((h) => h.id));
    }
    await letInHeroes(userId);
    heroes = await getNotHiredHeroes(userId);
  }
  return heroes;
};

const isItTimeToReplenishHeroes = (heroes) => {
  const dayAgo = new Date(new Date().getTime() - 60 * 60 * 1000);
  return heroes.length === 0 || heroes.some((h) => h.appear_at < dayAgo);
};

const seeingOffHeroes = async (heroIds) => {
  const ids = heroIds.join(",");
  return Promise.all([
    new Promise((resolve, reject) => {
      usePool(
        `delete from public.hero_equipment where hero_id in (${ids})`,
        [],
        (error, _) => {
          if (error) {
            return reject(new Error(`seeingOffHeroes - equip ${error}`));
          }
          resolve({});
        }
      );
    }),

    new Promise((resolve, reject) => {
      usePool(
        `delete from public.hero where id in (${ids})`,
        [],
        (error, _) => {
          if (error) {
            return reject(new Error(`seeingOffHeroes - heroes ${error}`));
          }
          resolve({});
        }
      );
    }),
  ]);
};

const letInHeroes = async (userId) => {
  const heroes = [];
  const poolSize = 1; //Math.floor(Math.random() * 7) + 3;
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
    });
  }

  await persistHeroes(userId, heroes);

  const newlyArrived = await getNotHiredHeroes(userId);

  await giveHeroesEqipment(newlyArrived);
};

const persistHeroes = async (userId, heroes) => {
  const heroesData = heroes
    .map(
      (hero) =>
        `select 
            ${userId}, '${hero.name}', '${hero.type}', 
            ${hero.power}, ${hero.defence}, ${hero.vitality}, ${hero.initiative},
            ${hero.health}, ${hero.experience}, ${hero.gold}, now()`
    )
    .join(" union ");
  return new Promise((resolve, reject) => {
    usePool(
      `insert into public.hero 
       (user_id, name, type, power, defence, vitality, initiative, 
        health, experience, gold, appear_at)
       select * from (${heroesData}) as vals`,
      [],
      (error, _) => {
        if (error) {
          reject(new Error(`persistHeroes ${error}`));
        }
        resolve({});
      }
    );
  });
};

const giveHeroesEqipment = async (heroes) => {
  const defaultArmor = heroes
    .map((hero) => `select ${hero.id}, 3`)
    .join(" union ");

  const defaultWeapon = heroes
    .map((hero) => `select ${hero.id}, ${hero.type === "mage" ? 2 : 1}`)
    .join(" union ");

  return new Promise((resolve, reject) => {
    usePool(
      `insert into public.hero_equipment (hero_id, equipment_id)
       select * from (${defaultArmor} union ${defaultWeapon}) as vals;`,
      [],
      (error, _) => {
        if (error) {
          return reject(new Error(`giveHeroesEqipment ${error}`));
        }
        resolve({});
      }
    );
  });
};

export { getTavernPatrons };
