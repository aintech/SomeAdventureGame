import { HeroResponse, StatsHolder } from "../../services/HeroesService";
import { HEALTH_PER_VITALITY } from "../../utils/variables";
import Equipment, { convert as convertEquipment } from "../Equipment";
import PersonageStats from "../PersonageStats";
import HeroOccupation, { convertOccupation } from "./HeroOccupation";
import { HeroType, heroTypeFromString } from "./HeroType";

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
    public occupation: HeroOccupation | null,
    public equipment: Equipment[]
  ) {}

  public isAilve() {
    return this.health > 0;
  }
}

const calcHealthFraction = (hero: Hero): number => {
  return hero.health / (hero.stats.vitality * HEALTH_PER_VITALITY);
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

/**
 * FIXME: когда бэк переедет на PG и Typescript то через АПИ начнут
 * приходить числа в нормальном формате вместо строки,
 * и можно будет поубирать плюсики из конвертеров
 */
const convert = (response: HeroResponse): Hero => {
  return new Hero(
    +response.id,
    response.name,
    heroTypeFromString(response.type),
    +response.level,
    new PersonageStats(
      +response.power,
      +response.defence,
      +response.vitality,
      +response.initiative
    ),
    new PersonageStats(
      getRawStat("power")(response)(response.equipment),
      getRawStat("defence")(response)(response.equipment),
      getRawStat("vitality")(response)(response.equipment),
      getRawStat("initiative")(response)(response.equipment)
    ),
    +response.health,
    +response.experience,
    +response.progress,
    +response.gold,
    response.embarked_quest ? +response.embarked_quest : null,
    convertOccupation(response),
    response.equipment.map((e) => convertEquipment(e))
  );
};

export { calcHealthFraction, convert };
