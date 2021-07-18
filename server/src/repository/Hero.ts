import { HEALTH_PER_VITALITY } from "../utils/Variables";
import query from "./Db";
import { HeroActivityType } from "./HeroActivity";

type Level = {
  level: number;
  experience: number;
};

type Equipment = {
  id: number;
  hero_id: number;
  equipment_id: number;
  name: string;
  description: string;
  type: string;
  level: number;
  power: number;
  defence: number;
  vitality: number;
  initiative: number;
  price: number;
  warrior: boolean;
  mage: boolean;
  avatar: string;
};

export type Item = {
  id: number;
  hero_id: number;
  type: string;
  amount: number;
};

type Hero = {
  id: number;
  user_id: number;
  name: string;
  type: string;
  power: number;
  defence: number;
  health: number;
  experience: number;
  gold: number;
  vitality: number;
  initiative: number;
  hired: boolean;
  appear_at: Date;
  /** activity part */
  activity_type: HeroActivityType;
  activity_id: number | null;
  started_at: Date;
  duration: number | null;
};

type HeroWithLevel = Hero & { level: number };

type HeroWithLevelProgress = HeroWithLevel & { progress: number };

type HeroWithEquipment = HeroWithLevelProgress & { equipment: Equipment[] };

export type HeroWithItems = HeroWithEquipment & { items: Item[] };

const selectQuery = `
     select *
     from public.hero h 
     left join public.hero_activity a on a.hero_id = h.id`;

let maxLevel = 0;
const levels: Level[] = [];
const fetchLevels = () => {
  return query<Level[]>("fetchLevels", "select * from public.hero_level");
};

const checkLevelsLoaded = async () => {
  if (levels.length === 0) {
    await fetchLevels().then((data) => levels.push(...data));
    maxLevel = Math.max(...levels.map((l) => l.level));
  }
};

const calcHeroLevel = (hero: Hero) => {
  return Math.max(...levels.filter((l) => l.experience < hero.experience).map((l) => l.level));
};

const calcLevelProgress = (hero: HeroWithLevel) => {
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

const addLevelInfo = async (heroes: Hero[]) => {
  await checkLevelsLoaded();
  if (heroes.length === 0) {
    return [];
  }
  return heroes
    .map((h) => {
      return { ...h, level: calcHeroLevel(h) } as HeroWithLevel;
    })
    .map((h) => {
      return { ...h, progress: calcLevelProgress(h) } as HeroWithLevelProgress;
    });
};

const addEquipment = async (heroes: HeroWithLevelProgress[]) => {
  if (heroes.length === 0) {
    return [];
  }

  const equipment = await query<Equipment[]>(
    "addEquipment",
    `select * from public.hero_equipment he
     left join public.equipment e on e.id = he.equipment_id
     where he.hero_id in (${heroes.map((h) => h.id).join(",")})`
  );

  const equipedHeroes: HeroWithEquipment[] = [];
  heroes.forEach((h) => {
    equipedHeroes.push({
      ...h,
      equipment: equipment.filter((e) => e.hero_id === h.id),
    });
  });

  return equipedHeroes;
};

const addItems = async (heroes: HeroWithEquipment[]) => {
  if (heroes.length === 0) {
    return [];
  }
  const items = await query<Item[]>(
    "addItems",
    `select * from public.hero_item 
     where hero_id in (${heroes.map((h) => h.id).join(",")})`
  );

  const heroWithItems: HeroWithItems[] = [];
  heroes.forEach((h) => heroWithItems.push({ ...h, items: items.filter((i) => i.hero_id === h.id) }));

  return heroWithItems;
};

const prepareHeroes = async (heroes: Hero[]) => {
  return addItems(await addEquipment(await addLevelInfo(heroes)));
};

/**
 * У атрибутов (power, health и т.д.) значения указаны уже с учётом экипировки!
 * так сделано чтобы не подмешивать в разных местах характеристики экипировки при расчёте
 * характеристик героя.
 */
const getHeroes = async (userId: number) => {
  return query<HeroWithItems[]>(
    "getHeroes",
    `${selectQuery} where user_id = $1 and hired = true`,
    [userId],
    prepareHeroes
  );
};

//TODO: конверсия activity в объект
const getHeroesByIds = async (heroIds: number[]) => {
  return query<HeroWithItems[]>(
    "getHeroesByIds",
    `${selectQuery} where id in (${heroIds.join(",")})`,
    [],
    prepareHeroes
  );
};

const getNotHiredHeroes = async (userId: number) => {
  return query<HeroWithItems[]>(
    "getNotHiredHeroes",
    `${selectQuery} where user_id = $1 and hired = false`,
    [userId],
    prepareHeroes
  );
};

const hireHero = async (userId: number, heroId: number) => {
  await Promise.all([
    query<void>(
      "hireHero - stats",
      `update public.stats 
       set gold = gold - (select gold from public.hero where id = $2)
       where user_id = $1`,
      [userId, heroId]
    ),
    query<void>("hireHero - hired", `update public.hero set hired = true where id = $1`, [heroId]),
    query<void>("hireHero - activity", `insert into public.hero_activity (hero_id) values ($1)`, [heroId]),
  ]);

  return getHeroesByIds([heroId]);
};

const dismissHero = async (heroId: number) => {
  await query<void>("dismissHero - equipment", `delete from public.hero_equipment where hero_id = $1`, [heroId]);

  await query<void>("dismissHero - activity", `delete from public.hero_activity where hero_id = $1`, [heroId]);

  await query<void>("dismissHero - hero", `delete from public.hero where id = $1`, [heroId]);
};

const setHeroHealth = (heroId: number, amount: number) => {
  return query<void>(
    "adjustHeroHealth",
    `update public.hero 
     set health = $2
     where id = $1`,
    [heroId, amount]
  );
};

const adjustHeroHealth = (heroId: number, amount: number) => {
  return query<void>(
    "adjustHeroHealth",
    `update public.hero 
     set health = greatest(0, least(health + $2, vitality * $3)) 
     where id = $1`,
    [heroId, amount, HEALTH_PER_VITALITY]
  );
};

type HeroHP = {
  id: number;
  health: number;
  total: number;
};

const getHeroesHP = async (questId: number) => {
  return query<HeroHP[]>(
    "getHeroesHP",
    `select h.id, h.health, (h.vitality * $2) as total
     from public.hero h
     left join public.hero_activity a on a.hero_id = h.id
     where a.activity_id = $1 and a.activity_type = '${HeroActivityType[HeroActivityType.QUEST].toLowerCase()}'`,
    [questId, HEALTH_PER_VITALITY]
  );
};

const adjustHeroGold = (heroId: number, amount: number) => {
  return query<void>("adjustGold", `update public.hero set gold = (gold + $2) where id = $1`, [heroId, amount]);
};

const getHeroesOnQuest = (userId: number, questId: number) => {
  return query<HeroWithItems[]>(
    "getHeroesOnQuest",
    `${selectQuery} where user_id = $1 and a.activity_id = $2`,
    [userId, questId],
    prepareHeroes
  );
};

const rewardHeroesForQuest = async (userId: number, heroIds: number[], heroesTribute: number, experience: number) => {
  const tributePerHero = Math.floor(heroesTribute / heroIds.length);
  const experiencePerHero = Math.floor(experience / heroIds.length);

  await query<void>(
    "completeHeroesQuest",
    `update public.hero
     set gold = (gold + $1), experience = (experience + $2)
     where id in (${heroIds.join(",")})`,
    [tributePerHero, experiencePerHero]
  );
};

export {
  getHeroes,
  getHeroesByIds,
  getNotHiredHeroes,
  hireHero,
  dismissHero,
  setHeroHealth,
  adjustHeroHealth,
  getHeroesHP,
  adjustHeroGold,
  getHeroesOnQuest,
  rewardHeroesForQuest,
};
