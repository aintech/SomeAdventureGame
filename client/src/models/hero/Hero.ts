import { HeroResponse } from "../../services/HeroesService";
import { HEALTH_PER_VITALITY } from "../../utils/variables";
import Equipment, { convert as convertEquipment, getEquipmentStats } from "../Equipment";
import PersonageStats from "../PersonageStats";
import HeroActivity, { convert as convertActivity } from "./HeroActivity";
import HeroItem, { convert as convertItem } from "./HeroItem";
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
    public health: number,
    public gold: number,
    public equipment: Equipment[],
    public items: HeroItem[],
    public perks: HeroPerk[],
    public skills: HeroSkill[],
    public activity?: HeroActivity,
    public isHero: boolean = true
  ) {}

  public isAlive() {
    return this.health > 0;
  }
}

export const calcHealthFraction = (hero: Hero): number => {
  return hero.health / ((hero.stats.vitality + getEquipmentStats(hero.equipment).vitality) * HEALTH_PER_VITALITY);
};

export const convert = (response: HeroResponse): Hero => {
  return new Hero(
    response.id,
    response.name,
    response.type,
    convertLevel(response.level),
    new PersonageStats(response.power, response.defence, response.vitality, response.initiative),
    response.health,
    response.gold,
    response.equipment.map((e) => convertEquipment(e)),
    response.items.map((i) => convertItem(i)),
    response.perks.map((p) => convertPerk(p)),
    response.skills.map((s) => convertSkill(s)),
    response.activity ? convertActivity(response.activity) : undefined
  );
};
