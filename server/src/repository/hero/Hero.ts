import { HEALTH_PER_VITALITY } from "../../utils/Variables";
import query from "../Db";
import { Equipment, HeroEquipment, withEquipment } from "../Equipment";
import { HeroActivity, HeroActivityType } from "./HeroActivity";
import { Item, withItems } from "./Item";
import { HeroLevel, withLevelInfo } from "./Level";
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
  health: number;
  power: number;
  defence: number;
  vitality: number;
  initiative: number;
  gold: number;
  hired: boolean;
  appearAt: Date;
  /** activity part - exists only for hired heroes */
  activity?: HeroActivity;
};

export type HeroWithEquipment = Hero & { equipment: HeroEquipment[] };

export type HeroWithItems = HeroWithEquipment & { items: Item[] };

export type HeroWithPerks = HeroWithItems & { perks: Perk[] };

export type HeroWithSkills = HeroWithPerks & { skills: Skill[] };

const selectQuery = `
     select *
     from public.hero h 
     left join public.hero_activity a on a.hero_id = h.id`;

const prepareHeroes = async (heroes: Hero[]) => {
  return withSkills(await withPerks(await withItems(await withEquipment(await withLevelInfo(heroes)))));
};

/**
 * УХОДИМ ОТ ЭТОГО!!!
 * У атрибутов (power, health и т.д.) значения указаны уже с учётом экипировки!
 * так сделано чтобы не подмешивать в разных местах характеристики экипировки при расчёте
 * характеристик героя.
 */
export const getHeroes = async (userId: number) => {
  return query<HeroWithSkills[]>(
    "getHeroes",
    `${selectQuery} where user_id = $1 and hired = true`,
    [userId],
    mapHero,
    prepareHeroes
  );
};

export const getHeroesByIds = async (heroIds: number[]) => {
  return query<HeroWithSkills[]>(
    "getHeroesByIds",
    `${selectQuery} where id in (${heroIds.join(",")})`,
    [],
    mapHero,
    prepareHeroes
  );
};

export const getNotHiredHeroes = async (userId: number) => {
  return query<HeroWithSkills[]>(
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
  return query<HeroWithSkills[]>(
    "getHeroesOnQuest",
    `${selectQuery} where user_id = $1 and a.activity_id = $2`,
    [userId, questId],
    mapHero,
    prepareHeroes
  );
};

export const updateHeroLevel = (heroId: number, level: number, addPower: number, addVitality: number) => {
  return query<void>(
    "updateHeroLevel",
    "update public.hero set level = $2, power = power + $3, vitality = vitality + $4 where id = $1",
    [heroId, level, addPower, addVitality]
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
  description: string | null;
  duration: string | null;
};

const mapHero = (row: HeroRow): Hero => {
  return {
    id: +row.id,
    userId: +row.user_id,
    name: row.name,
    type: +row.type,
    level: { lvl: +row.level, experience: +row.experience },
    power: +row.power,
    defence: +row.defence,
    health: +row.health,
    gold: +row.gold,
    vitality: +row.vitality,
    initiative: +row.initiative,
    hired: row.hired,
    appearAt: row.appear_at,
    activity: row.activity_type
      ? {
          heroId: +row.id,
          type: +row.activity_type,
          description: row.description!,
          startedAt: row.started_at!,
          activityId: row.activity_id !== null ? +row.activity_id : undefined,
          duration: row.duration !== null ? +row.duration : undefined,
        }
      : undefined,
  };
};

const mapHeroHP = (row: { id: string; health: string; total: string }) => {
  return { id: +row.id, health: +row.health, total: +row.total };
};
