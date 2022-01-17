import { HeroItemResponse, ItemResponse } from '../services/HeroService';

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
    public buyingTime: number
  ) {}
}

export class HeroItem extends Item {
  public amount: number = 0;
}

export const convertItem = (response: ItemResponse): Item => {
  return new Item(response.id, response.name, response.description, response.price, response.type, response.subtype, response.buyingTime);
};

export const convertHeroItem = (response: HeroItemResponse): HeroItem => {
  const item = convertItem(response);
  return {
    ...item,
    amount: response.amount,
  };
};
