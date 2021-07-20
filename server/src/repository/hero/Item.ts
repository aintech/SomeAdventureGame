import query from "../Db";
import { HeroWithEquipment, HeroWithItems } from "./Hero";

export enum ItemType {
  HEALTH_POTION,
  HEALTH_ELIXIR,
  MANA_POTION,
}

export type Item = {
  id: number;
  heroId: number;
  type: ItemType;
  amount: number;
};

export const withItems = async (heroes: HeroWithEquipment[]) => {
  if (heroes.length === 0) {
    return [];
  }
  const items = await query<Item[]>(
    "withItems",
    `select * from public.hero_item 
     where hero_id in (${heroes.map((h) => h.id).join(",")})`,
    [],
    mapItem
  );

  const heroWithItems: HeroWithItems[] = [];
  heroes.forEach((h) => heroWithItems.push({ ...h, items: items.filter((i) => i.heroId === h.id) }));

  return heroWithItems;
};

export const adjustItems = (heroId: number, type: string, amount: number) => {
  return query<void>(
    "adjustItems",
    `merge into public.hero_item hi 
     values ($1 as hero_id, $2 as type, $3 as amount) v
     on v.hero_id = hi.hero_id and v.type = hi.type
     when not matched
        insert values (v.hero_id, v.type, v.amount)
     when matched
        update set amount = amount + v.amount`,
    [heroId, type, amount]
  );
};

export const adjustItemsById = (itemId: number, amount: number) => {
  return query<void>("adjustItems", `update public.hero_item set amount = amount + $2 where id = $1`, [itemId, amount]);
};

type ItemRow = {
  id: string;
  hero_id: string;
  type: string;
  amount: string;
};

const mapItem = (row: ItemRow): Item => {
  return {
    id: +row.id,
    heroId: +row.hero_id,
    type: mapItemType(row.type),
    amount: +row.amount,
  };
};

const mapItemType = (type: string): ItemType => {
  switch (type) {
    case "health_potion":
      return ItemType.HEALTH_POTION;
    case "health_elixir":
      return ItemType.HEALTH_ELIXIR;
    case "mana_potion":
      return ItemType.MANA_POTION;
    default:
      throw new Error(`Unknown item type ${type}`);
  }
};
