import { HeroItemResponse, ItemResponse } from "../services/HeroesService";

export enum ItemType {
  POTION,
}

export enum ItemSubtype {
  HEALTH_POTION,
  HEALTH_ELIXIR,
  MANA_POTION,
}

export default class Item {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public avatar: string,
    public type: ItemType,
    public subtype: ItemSubtype,
    public buyingTime: number
  ) {}
}

export class HeroItem extends Item {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public avatar: string,
    public type: ItemType,
    public subtype: ItemSubtype,
    public buyingTime: number,
    public amount: number
  ) {
    super(id, name, description, price, avatar, type, subtype, buyingTime);
  }
}

export const convertItem = (response: ItemResponse): Item => {
  return new Item(
    response.id,
    response.name,
    response.description,
    response.price,
    response.avatar,
    response.type,
    response.subtype,
    response.buyingTime
  );
};

export const convertHeroItem = (response: HeroItemResponse): HeroItem => {
  const item = convertItem(response);
  return {
    ...item,
    amount: response.amount,
  };
};
