import { HEALTH_PER_VITALITY } from "../utils/variables";
import Equipment, { convert as convertEquipment } from "./Equipment";
import PersonageStats from "./PersonageStats";

enum HeroType {
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
const getRawStat = (heroApiResponse: any, statName: string): number => {
  return (
    +heroApiResponse[statName] -
    heroApiResponse.equipment
      .map((e: any) => +e[statName])
      .reduce((a: number, b: number) => a + b)
  );
};

const convert = (heroApiResponse: any): Hero => {
  return new Hero(
    +heroApiResponse.id,
    heroApiResponse.name,
    convertType(heroApiResponse.type),
    +heroApiResponse.level,
    new PersonageStats(
      +heroApiResponse.power,
      +heroApiResponse.defence,
      +heroApiResponse.vitality,
      +heroApiResponse.initiative
    ),
    new PersonageStats(
      getRawStat(heroApiResponse, "power"),
      getRawStat(heroApiResponse, "defence"),
      getRawStat(heroApiResponse, "vitality"),
      getRawStat(heroApiResponse, "initiative")
    ),
    +heroApiResponse.health,
    +heroApiResponse.experience,
    +heroApiResponse.progress,
    +heroApiResponse.gold,
    heroApiResponse.embarked_quest ? +heroApiResponse.embarked_quest : null,
    (heroApiResponse.equipment as any[]).map((e) => convertEquipment(e))
  );
};

export { HeroType, calcHealthFraction, typeName, convertType, convert };
