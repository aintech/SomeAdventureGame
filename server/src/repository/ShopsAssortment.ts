import query from "./Db";
import { Equipment, fetchEquipment } from "./Equipment";
import { fetchItems, Item } from "./Item";

let marketAssortment: Equipment[] = [];
export const getMarketAssortment = async (userId: number) => {
  if (marketAssortment.length === 0) {
    const allEquipment = await fetchEquipment();

    const availableEquipment = await query<number[]>(
      "getMarketAssortment",
      "select equipment_id from public.user_market_assortment where user_id = $1",
      [userId],
      (row: { equipment_id: string }) => +row.equipment_id
    );

    marketAssortment = allEquipment.filter((e) => availableEquipment.includes(e.id));
  }

  return marketAssortment;
};

let alchemistAssortment: Item[] = [];
export const getAlchemistAssortment = async (userId: number) => {
  if (alchemistAssortment.length === 0) {
    const allItems = await fetchItems();

    const availableItems = await query<number[]>(
      "getAlchemistAssortment",
      "select item_id from public.user_alchemist_assortment where user_id = $1",
      [userId],
      (row: { item_id: string }) => +row.item_id
    );

    alchemistAssortment = allItems.filter((i) => availableItems.includes(i.id));
  }

  return alchemistAssortment;
};

export const initShopsAssortment = async (userId: number) => {
  return Promise.all([
    query<void>("InitMarketAssortment", `insert into public.user_market_assortment select ${userId}, id from public.equipment`),
    query<void>("InitAlchemistAssortment", `insert into public.user_alchemist_assortment select ${userId}, id from public.item`),
  ]);
};
