import { HeroResponse, StatsHolder } from "../services/HeroesService";
import { HEALTH_PER_VITALITY } from "../utils/variables";
import Equipment, { convert as convertEquipment } from "./Equipment";
import PersonageStats from "./PersonageStats";

export enum HeroType {
  WARRIOR,
  MAGE,
}

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
    public embarkedQuest: number | null,
    public equipment: Equipment[]
  ) {}
}

const typeName = (type: HeroType) => {
  switch (type) {
    case HeroType.WARRIOR:
      return "Воин";
    case HeroType.MAGE:
      return "Маг";
    default:
      throw new Error(`Unknown hero type ${HeroType[type]}`);
  }
};

const calcHealthFraction = (hero: Hero): number => {
  return hero.health / (hero.stats.vitality * HEALTH_PER_VITALITY);
};

const convertType = (type: string): HeroType => {
  switch (type) {
    case "warrior":
      return HeroType.WARRIOR;
    case "mage":
      return HeroType.MAGE;
    default:
      throw new Error(`Unknown hero class ${type}`);
  }
};

/** Computes 'initial' hero stats without equipment surpluses */
const getRawStat =
  <T extends StatsHolder, U extends keyof T>(stat: U) =>
  (hero: T) =>
  (equipment: T[]): number => {
    return (
      +hero[stat] - equipment.map((e: T) => +e[stat]).reduce((a, b) => a + b)
    );
  };

const convert = (response: HeroResponse): Hero => {
  return new Hero(
    response.id,
    response.name,
    convertType(response.type),
    response.level,
    new PersonageStats(
      response.power,
      response.defence,
      response.vitality,
      response.initiative
    ),
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
    response.embarked_quest ? response.embarked_quest : null,
    response.equipment.map((e) => convertEquipment(e))
  );
};

export { calcHealthFraction, typeName, convertType, convert };
