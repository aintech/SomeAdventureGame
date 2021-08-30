import query from "./Db";
import { HeroWithEquipment, HeroWithItems } from "./hero/Hero";

export enum ItemType {
  POTION,
}

export enum ItemSubtype {
  HEALTH_POTION,
  HEALTH_ELIXIR,
  MANA_POTION,
}

export type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  avatar: string;
  type: ItemType;
  subtype: ItemSubtype;
  buyingTime: number;
};

export type HeroItem = Item & {
  heroId: number;
  amount: number;
};

export const fetchItems = async () => {
  return query<Item[]>("fetchItems", `select * from public.item`, [], mapItem);
};

export const withItems = async (heroes: HeroWithEquipment[]) => {
  if (heroes.length === 0) {
    return [];
  }
  const items = await query<HeroItem[]>(
    "withItems",
    `select * from public.hero_item hi
     left join public.item i on i.id = hi.item_id
     where hi.hero_id in (${heroes.map((h) => h.id).join(",")})`,
    [],
    mapHeroItem
  );

  const heroWithItems: HeroWithItems[] = [];
  heroes.forEach((h) => heroWithItems.push({ ...h, items: items.filter((i) => i.heroId === h.id) }));

  return heroWithItems;
};

export const adjustItems = (heroId: number, itemId: number, amount: number) => {
  return query<void>(
    "adjustItems",
    `insert into public.hero_item as hi
     (hero_id, item_id, amount)
     values ($1, $2, $3)
     on conflict (hero_id, item_id)
     do update set amount = hi.amount + $3`,
    [heroId, itemId, amount]
  );
};

type ItemRow = {
  id: string;
  name: string;
  description: string;
  price: string;
  avatar: string;
  type: string;
  subtype: string;
  buying_time: string;
};

type HeroItemRow = ItemRow & {
  hero_id: string;
  amount: string;
};

const mapItem = (row: ItemRow): Item => {
  return {
    id: +row.id,
    name: row.name,
    description: row.description,
    price: +row.price,
    avatar: row.avatar,
    type: +row.type,
    subtype: +row.subtype,
    buyingTime: +row.buying_time,
  };
};

const mapHeroItem = (row: HeroItemRow): HeroItem => {
  const item = mapItem(row);
  return {
    ...item,
    heroId: +row.hero_id,
    amount: +row.amount,
  };
};
