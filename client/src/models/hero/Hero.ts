import { HeroResponse, StatsHolder } from "../../services/HeroesService";
import { HEALTH_PER_VITALITY } from "../../utils/variables";
import Equipment, { convert as convertEquipment } from "../Equipment";
import PersonageStats from "../PersonageStats";
import HeroActivity, { convert as convertActivity } from "./HeroActivity";
import HeroItem, { convert as convertItem } from "./HeroItem";
import HeroPerk, { convert as convertPerk } from "./HeroPerk";
import HeroSkill, { convert as convertSkill } from "./HeroSkill";
import { HeroType } from "./HeroType";

export default class Hero {
  constructor(
    public id: number,
    public name: string,
    public type: HeroType,
    public level: number,
    public stats: PersonageStats,
    /** Stats without equipment surpluses */
    public rawStats: PersonageStats,
    public health: number,
    public experience: number,
    /** Relation of hero current experience to experience hero must acquire to reach next level */
    public progress: number,
    public gold: number,
    public activity: HeroActivity | null,
    public equipment: Equipment[],
    public items: HeroItem[],
    public perks: HeroPerk[],
    public skills: HeroSkill[],
    public isHero: boolean = true
  ) {}

  public isAilve() {
    return this.health > 0;
  }
}

export const calcHealthFraction = (hero: Hero): number => {
  return hero.health / (hero.stats.vitality * HEALTH_PER_VITALITY);
};

/** Computes 'initial' hero stats without equipment surpluses */
const getRawStat =
  <T extends StatsHolder, U extends keyof T>(stat: U) =>
  (hero: T) =>
  (equipment: T[]): number => {
    return +hero[stat] - equipment.map((e: T) => +e[stat]).reduce((a, b) => a + b);
  };

export const convert = (response: HeroResponse): Hero => {
  return new Hero(
    response.id,
    response.name,
    response.type,
    response.level,
    new PersonageStats(response.power, response.defence, response.vitality, response.initiative),
    new PersonageStats(
      getRawStat("power")(response)(response.equipment),
      getRawStat("defence")(response)(response.equipment),
      getRawStat("vitality")(response)(response.equipment),
      getRawStat("initiative")(response)(response.equipment)
    ),
    response.health,
    response.experience,
    response.progress,
    response.gold,
    convertActivity(response),
    response.equipment.map((e) => convertEquipment(e)),
    response.items.map((i) => convertItem(i)),
    response.perks.map((p) => convertPerk(p)),
    response.skills.map((s) => convertSkill(s))
  );
};
