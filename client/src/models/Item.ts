import { HeroItemResponse, ItemResponse } from '../services/HeroService';
import { TargetType } from './hero/HeroSkill';

export enum ItemType {
  POTION,
  WAND,
}

export enum ItemSubtype {
  HEALTH_POTION,
  HEALTH_ELIXIR,
  MANA_POTION,
  MANA_ELIXIR,

  WAND_FIREBALL,
  WAND_STUN,
}

export default class Item {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public type: ItemType,
    public subtype: ItemSubtype,
    public buyingTime: number,
    public target: TargetType
  ) {}
}

export class HeroItem extends Item {
  public amount: number = 0;
}

export const convertItem = (response: ItemResponse): Item => {
  return new Item(
    response.id,
    response.name,
    response.description,
    response.price,
    response.type,
    response.subtype,
    response.buyingTime,
    convertTarget(response)
  );
};

export const convertHeroItem = (response: HeroItemResponse): HeroItem => {
  const item = convertItem(response);
  return {
    ...item,
    amount: response.amount,
  };
};

const convertTarget = (response: ItemResponse): TargetType => {
  switch (response.subtype) {
    case ItemSubtype.HEALTH_POTION:
    case ItemSubtype.HEALTH_ELIXIR:
    case ItemSubtype.MANA_POTION:
    case ItemSubtype.MANA_ELIXIR:
      return TargetType.HERO;

    case ItemSubtype.WAND_FIREBALL:
    case ItemSubtype.WAND_STUN:
      return TargetType.ENEMY;

    default:
      throw new Error(`Unknown item type ${ItemSubtype[response.subtype]}`);
  }
};
