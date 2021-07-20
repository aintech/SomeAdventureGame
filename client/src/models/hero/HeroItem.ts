import { HeroItemResponse } from "../../services/HeroesService";

export enum HeroItemType {
  HEALTH_POTION,
  HEALTH_ELIXIR,
  MANA_POTION,
}

export default class HeroItem {
  constructor(public id: number, public type: HeroItemType, public amount: number) {}
}

export const getItemName = (type: HeroItemType) => {
  switch (type) {
    case HeroItemType.HEALTH_POTION:
      return "Зелье здоровья";
    case HeroItemType.HEALTH_ELIXIR:
      return "Эликсир здоровья";
    case HeroItemType.MANA_POTION:
      return "Зелье маны";
    default:
      throw new Error(`Unknown item type ${HeroItemType[type]}`);
  }
};

export const convertItem = (response: HeroItemResponse): HeroItem => {
  return new HeroItem(response.id, response.type, response.amount);
};
