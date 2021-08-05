import query from "./Db";
import { Equipment, fetchEquipment } from "./Equipment";

let equipment: Equipment[] = [];
export const getAssortment = async (userId: number) => {
  if (equipment.length === 0) {
    equipment = await fetchEquipment();
  }

  const availbleEquipment = await query<number[]>(
    "getAssortment",
    "select equipment_id from public.user_market_assortment where user_id = $1",
    [userId],
    (res: { equipment_id: string }) => +res.equipment_id
  );

  return equipment.filter((e) => availbleEquipment.includes(e.id));
};
