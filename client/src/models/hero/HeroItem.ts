import { HeroItemResponse } from "../../services/HeroesService";

export enum HeroItemType {
  HEALTH_POTION,
  HEALTH_ELIXIR,
  MANA_POTION,
}

export default class HeroItem {
  constructor(
    public id: number,
    public type: HeroItemType,
    public amount: number
  ) {}
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

const convertItemType = (type: string): HeroItemType => {
  switch (type) {
    case "health_potion":
      return HeroItemType.HEALTH_POTION;
    case "health_elixir":
      return HeroItemType.HEALTH_ELIXIR;
    case "mana_potion":
      return HeroItemType.MANA_POTION;
    default:
      throw new Error(`Unknown item type ${type}`);
  }
};

export const convertItem = (response: HeroItemResponse): HeroItem => {
  return new HeroItem(
    +response.id,
    convertItemType(response.type),
    +response.amount
  );
};
