import { HEALTH_PER_VITALITY } from "../../utils/Variables";
import query from "../Db";
import { HeroActivityType, mapHeroActivityType } from "./HeroActivity";
import { Item, withItems } from "./Item";
import { withEquipment, Equipment } from "./Equipment";
import { HeroLevel, withLevelUpInfo } from "./Level";
import { Perk, withPerks } from "./Perk";
import { Skill, withSkills } from "./Skill";

export enum HeroType {
  WARRIOR,
  MAGE,
  THIEF,
  HEALER,
  PALADIN,
}

//TODO: Добавить аттрибут Luck
export type Hero = {
  id: number;
  userId: number;
  name: string;
  type: HeroType;
  level: HeroLevel;
  power: number;
  defence: number;
  health: number;
  gold: number;
  vitality: number;
  initiative: number;
  hired: boolean;
  appearAt: Date;
  /** activity part - exists only for hired heroes */
  activityType: HeroActivityType | null;
  activityId: number | null;
  startedAt: Date | null;
  duration: number | null;
};

export type HeroWithEquipment = Hero & { equipment: Equipment[] };

export type HeroWithItems = HeroWithEquipment & { items: Item[] };

export type HeroWithPerks = HeroWithItems & { perks: Perk[] };

export type HeroWithSkills = HeroWithPerks & { skills: Skill[] };

const selectQuery = `
     select *
     from public.hero h 
     left join public.hero_activity a on a.hero_id = h.id`;

const prepareHeroes = async (heroes: Hero[]) => {
  return withSkills(await withPerks(await withItems(await withEquipment(await withLevelUpInfo(heroes)))));
};

/**
 * У атрибутов (power, health и т.д.) значения указаны уже с учётом экипировки!
 * так сделано чтобы не подмешивать в разных местах характеристики экипировки при расчёте
 * характеристик героя.
 */
export const getHeroes = async (userId: number) => {
  return query<HeroWithPerks[]>(
    "getHeroes",
    `${selectQuery} where user_id = $1 and hired = true`,
    [userId],
    mapHero,
    prepareHeroes
  );
};

export const getHeroesByIds = async (heroIds: number[]) => {
  return query<HeroWithPerks[]>(
    "getHeroesByIds",
    `${selectQuery} where id in (${heroIds.join(",")})`,
    [],
    mapHero,
    prepareHeroes
  );
};

export const getNotHiredHeroes = async (userId: number) => {
  return query<HeroWithPerks[]>(
    "getNotHiredHeroes",
    `${selectQuery} where user_id = $1 and hired = false`,
    [userId],
    mapHero,
    prepareHeroes
  );
};

export const hireHero = async (userId: number, heroId: number) => {
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

export const dismissHero = async (heroId: number) => {
  await query<void>("dismissHero - equipment", `delete from public.hero_equipment where hero_id = $1`, [heroId]);
  await query<void>("dismissHero - activity", `delete from public.hero_activity where hero_id = $1`, [heroId]);
  await query<void>("dismissHero - items", `delete from public.hero_item where hero_id = $1`, [heroId]);
  await query<void>("dismissHero - perks", `delete from public.hero_perk where hero_id = $1`, [heroId]);
  await query<void>("dismissHero - hero", `delete from public.hero where id = $1`, [heroId]);
};

export const setHeroHealth = (heroId: number, amount: number) => {
  return query<void>(
    "adjustHeroHealth",
    `update public.hero 
     set health = $2
     where id = $1`,
    [heroId, amount]
  );
};

export const adjustHeroHealth = (heroId: number, amount: number) => {
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

export const getHeroesHP = async (questId: number) => {
  return query<HeroHP[]>(
    "getHeroesHP",
    `select h.id, h.health, (h.vitality * $2) as total
     from public.hero h
     left join public.hero_activity a on a.hero_id = h.id
     where a.activity_id = $1 and a.activity_type = '${HeroActivityType[HeroActivityType.QUEST].toLowerCase()}'`,
    [questId, HEALTH_PER_VITALITY],
    mapHeroHP
  );
};

export const adjustHeroGold = (heroId: number, amount: number) => {
  return query<void>("adjustGold", `update public.hero set gold = (gold + $2) where id = $1`, [heroId, amount]);
};

export const getHeroesOnQuest = (userId: number, questId: number) => {
  return query<HeroWithPerks[]>(
    "getHeroesOnQuest",
    `${selectQuery} where user_id = $1 and a.activity_id = $2`,
    [userId, questId],
    mapHero,
    prepareHeroes
  );
};

export const rewardHeroesForQuest = async (
  userId: number,
  heroIds: number[],
  heroesTribute: number,
  experience: number
) => {
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

type HeroRow = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  level: string;
  power: string;
  defence: string;
  health: string;
  experience: string;
  gold: string;
  vitality: string;
  initiative: string;
  hired: boolean;
  appear_at: Date;
  activity_type: string | null;
  activity_id: string | null;
  started_at: Date | null;
  duration: string | null;
};

const mapHero = (row: HeroRow): Hero => {
  return {
    id: +row.id,
    userId: +row.user_id,
    name: row.name,
    type: mapHeroType(row.type),
    level: { lvl: +row.level, experience: +row.experience, tier: "", progress: 0, levelUp: null },
    power: +row.power,
    defence: +row.defence,
    health: +row.health,
    gold: +row.gold,
    vitality: +row.vitality,
    initiative: +row.initiative,
    hired: row.hired,
    appearAt: row.appear_at,
    activityType: row.activity_type ? mapHeroActivityType(row.activity_type) : null,
    activityId: row.activity_id !== null ? +row.activity_id : null,
    startedAt: row.started_at,
    duration: row.duration !== null ? +row.duration : null,
  };
};

const mapHeroType = (type: string) => {
  switch (type) {
    case "warrior":
      return HeroType.WARRIOR;
    case "mage":
      return HeroType.MAGE;
    case "thief":
      return HeroType.THIEF;
    case "healer":
      return HeroType.HEALER;
    case "paladin":
      return HeroType.PALADIN;
    default:
      throw new Error(`Unknown hero type ${type}`);
  }
};

const mapHeroHP = (row: { id: string; health: string; total: string }) => {
  return { id: +row.id, health: +row.health, total: +row.total };
};
