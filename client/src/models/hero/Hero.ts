import { HeroResponse } from "../../services/HeroService";
import { HEALTH_PER_VITALITY } from "../../utils/Variables";
import Equipment, { convert as convertEquipment, getEquipmentStats } from "../Equipment";
import PersonageStats from "../PersonageStats";
import HeroActivity, { convert as convertActivity } from "./HeroActivity";
import { HeroItem, convertHeroItem } from "../Item";
import HeroLevel, { convert as convertLevel } from "./HeroLevel";
import HeroPerk, { convert as convertPerk } from "./HeroPerk";
import HeroSkill, { convert as convertSkill } from "./HeroSkill";
import { HeroType } from "./HeroType";

export default class Hero {
  constructor(
    public id: number,
    public name: string,
    public type: HeroType,
    public level: HeroLevel,
    public stats: PersonageStats,
    public equipStats: PersonageStats, // aggregation of equipment stats surpluses
    public health: number,
    public gold: number,
    public equipment: Equipment[],
    public items: HeroItem[],
    public perks: HeroPerk[],
    public skills: HeroSkill[],
    public activity?: HeroActivity
  ) {}

  public isAlive() {
    return this.health > 0;
  }
}

export const calcHealthFraction = (hero: Hero): number => {
  return hero.health / maxHealth(hero);
};

export const maxHealth = (hero: Hero): number => {
  return (hero.stats.vitality + hero.equipStats.vitality) * HEALTH_PER_VITALITY;
};

export const convert = (response: HeroResponse): Hero => {
  const equipment = response.equipment.map((e) => convertEquipment(e));
  const equipStats = getEquipmentStats(equipment);
  return new Hero(
    response.id,
    response.name,
    response.type,
    convertLevel(response.level),
    new PersonageStats(response.power, response.defence, response.vitality, response.initiative),
    equipStats,
    response.health,
    response.gold,
    equipment,
    response.items.map((i) => convertHeroItem(i)),
    response.perks.map((p) => convertPerk(p)),
    response.skills.map((s) => convertSkill(s)),
    response.activity ? convertActivity(response.activity) : undefined
  );
};
