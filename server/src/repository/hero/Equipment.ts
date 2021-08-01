import query from "../Db";
import { HeroWithEquipment, Hero } from "./Hero";

export enum EquipmentType {
  WEAPON,
  ARMOR,
  SHIELD,
  ACCESSORY,
}

export type Equipment = {
  id: number;
  heroId: number;
  equipmentId: number;
  name: string;
  description: string;
  type: EquipmentType;
  level: number;
  power: number;
  defence: number;
  vitality: number;
  initiative: number;
  price: number;
  warrior: boolean;
  mage: boolean;
  avatar: string;
};

export const withEquipment = async (heroes: Hero[]) => {
  if (heroes.length === 0) {
    return [];
  }

  const equipment = await query<Equipment[]>(
    "withEquipment",
    `select * from public.hero_equipment he
       left join public.equipment e on e.id = he.equipment_id
       where he.hero_id in (${heroes.map((h) => h.id).join(",")})`,
    [],
    mapEquipment
  );

  const equipedHeroes: HeroWithEquipment[] = [];
  heroes.forEach((h) => {
    equipedHeroes.push({
      ...h,
      equipment: equipment.filter((e) => e.heroId === h.id),
    });
  });

  return equipedHeroes;
};

export type EquipmentRow = {
  id: string;
  hero_id: string;
  equipment_id: string;
  name: string;
  description: string;
  type: string;
  level: string;
  power: string;
  defence: string;
  vitality: string;
  initiative: string;
  price: string;
  warrior: boolean;
  mage: boolean;
  avatar: string;
};

const mapEquipment = (row: EquipmentRow): Equipment => {
  return {
    id: +row.id,
    heroId: +row.hero_id,
    equipmentId: +row.equipment_id,
    name: row.name,
    description: row.description,
    type: +row.type,
    level: +row.level,
    power: +row.power,
    defence: +row.defence,
    vitality: +row.vitality,
    initiative: +row.initiative,
    price: +row.price,
    warrior: row.warrior,
    mage: row.mage,
    avatar: row.avatar,
  };
};
