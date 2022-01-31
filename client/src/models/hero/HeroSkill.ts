import { HeroSkillResponse } from '../../services/HeroService';

export enum HeroSkillType {
  BIG_SWING,
  STUNNING_BLOW,
  ARMOR_CRASH,

  FIREBALL,
  FREEZE,
  TIME_FORWARD,

  BACKSTAB,
  POISON_HIT,
  DODGE,

  WORD_OF_HEALING,
  COMMON_GOOD,
  INSPIRATION,
}

export enum TargetType {
  SELF,
  HERO,
  ALL_HEROES,
  ENEMY,
}

export default class HeroSkill {
  constructor(
    public type: HeroSkillType,
    public target: TargetType,
    public name: string,
    public description: string,
    public mana: number
  ) {}
}

export const convert = (response: HeroSkillResponse): HeroSkill => {
  return new HeroSkill(response.type, convertTarget(response), response.name, response.description, response.mana);
};

const convertTarget = (response: HeroSkillResponse): TargetType => {
  switch (response.type) {
    case HeroSkillType.BIG_SWING:
    case HeroSkillType.STUNNING_BLOW:
    case HeroSkillType.ARMOR_CRASH:
    case HeroSkillType.FIREBALL:
    case HeroSkillType.FREEZE:
    case HeroSkillType.BACKSTAB:
    case HeroSkillType.POISON_HIT:
      return TargetType.ENEMY;

    case HeroSkillType.DODGE:
      return TargetType.SELF;

    case HeroSkillType.TIME_FORWARD:
    case HeroSkillType.WORD_OF_HEALING:
    case HeroSkillType.INSPIRATION:
      return TargetType.HERO;

    case HeroSkillType.COMMON_GOOD:
      return TargetType.ALL_HEROES;

    default:
      throw new Error(`Unknown skill type ${HeroSkillType[response.type]}`);
  }
};
