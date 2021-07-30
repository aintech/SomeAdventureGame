import generateHeroes, { GeneratedHero } from "../hero-generator/HeroGenerator";
import { TAVERN_PATRONS_REPLENISH_PERIOD } from "../utils/Variables";
import query from "./Db";
import { getNotHiredHeroes, Hero, HeroType, HeroWithEquipment, HeroWithItems } from "./hero/Hero";
import { getPerks, Perk } from "./hero/Perk";

export const getTavernPatrons = async (userId: number) => {
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

const isItTimeToReplenishPatrons = (heroes: Hero[]) => {
  const dayAgo = new Date(new Date().getTime() - TAVERN_PATRONS_REPLENISH_PERIOD);
  return heroes.length === 0 || heroes.some((h) => h.appearAt < dayAgo);
};

const seeingOffPatrons = async (heroIds: number[]) => {
  const ids = heroIds.join(",");
  return Promise.all([
    query<void>("seeingOffPatrons - equip", `delete from public.hero_equipment where hero_id in (${ids})`),
    query<void>("seeingOffPatrons - items", `delete from public.hero_item where hero_id in (${ids})`),
    query<void>("seeingOffPatrons - perks", `delete from public.hero_perk where hero_id in (${ids})`),
    query<void>("seeingOffPatrons - heroes", `delete from public.hero where id in (${ids})`),
  ]);
};

const letInHeroes = async (userId: number) => {
  await persistPatrons(userId, generateHeroes());
  const generated = await getNotHiredHeroes(userId);
  await givePatronsEqipment(generated);
  await givePatronsItems(generated);
  await givePatronsPerks(generated);
};

const persistPatrons = async (userId: number, heroes: GeneratedHero[]) => {
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
     (user_id, name, type, power, defence, vitality, initiative, health, experience, gold, appear_at)
     select * from (${heroesData}) as vals`
  );
};

const givePatronsEqipment = async (heroes: Hero[]) => {
  const defaultArmor = heroes.map((hero) => `(${hero.id}, 3)`).join(",");
  const defaultWeapon = heroes.map((hero) => `(${hero.id}, ${hero.type === HeroType.MAGE ? 2 : 1})`).join(",");

  return query<void>(
    "givePatronsEqipment",
    `insert into public.hero_equipment (hero_id, equipment_id) values ${defaultArmor}, ${defaultWeapon};`
  );
};

const givePatronsItems = async (heroes: Hero[]) => {
  const defaultPotions = heroes.map((hero) => `(${hero.id}, 'health_potion', 3)`).join(",");

  const additionalPotions = heroes
    .map(
      (hero) =>
        `(${hero.id}, ${
          hero.type === HeroType.MAGE || hero.type === HeroType.HEALER ? `'mana_potion'` : `'health_elixir'`
        }, 3)`
    )
    .join(",");

  return query<void>(
    "givePatronsItems",
    `insert into public.hero_item (hero_id, type, amount) values ${defaultPotions}, ${additionalPotions}`
  );
};

const givePatronsPerks = async (heroes: Hero[]) => {
  const dbPerks = await getPerks();

  const insertPerks: string[] = [];
  heroes.forEach((hero) => {
    let rand = Math.random();
    const perksCount = rand > 0.75 ? 3 : rand > 0.5 ? 2 : 1; // rand > 0.5 ? 1 : 0;

    const perks: Perk[] = [];
    for (let i = 0; i < perksCount; i++) {
      rand = Math.floor(Math.random() * dbPerks.length);
      const perk = dbPerks[rand];
      if (!perks.includes(perk)) {
        perks.push(perk);
      }
    }

    insertPerks.push(perks.map((perk) => `(${hero.id}, ${perk.id})`).join(","));
  });

  if (insertPerks.length === 0) {
    return Promise.resolve();
  }

  return query<void>("givePatronsPerks", `insert into public.hero_perk (hero_id, perk_id) values ${insertPerks}`);
};
