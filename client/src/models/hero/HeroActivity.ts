import { HeroActivityResponse } from "../../services/HeroesService";

export enum HeroActivityType {
  IDLE /** Do nothing */,
  QUEST /** Embarked on Quest */,
  HEALING /** Heal wounds in Healer tent */,
  TRAINING /** Training new level in Training ground */,
  PURCHASING_EQUIPMENT /** Buying equipment on Market */,
  PURCHASING_POTIONS /** Buying potions in Alchemist */,
  PRAYING /** Seeking buffs in Temple */,
  UPGRADING_EQUIPMENT /** Upgrade equipment in Blacksmith */,
}

export default class HeroActivity {
  constructor(
    public type: HeroActivityType,
    public startedAt: Date,
    public description: string,
    public duration?: number,
    public activityId?: number
  ) {}
}

export const convert = (response: HeroActivityResponse): HeroActivity => {
  return new HeroActivity(
    response.type,
    new Date(response.startedAt),
    response.description,
    response.duration,
    response.activityId
  );
};
