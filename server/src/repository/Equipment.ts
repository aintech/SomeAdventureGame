import query from "./Db";
import { HeroWithEquipment, Hero } from "./hero/Hero";

export enum EquipmentType {
  WEAPON,
  ARMOR,
  SHIELD,
  ACCESSORY,
}

/** For simplicity at this point using ID as subtype */
export enum EquipmentSubtype {
  NONE,
  RUSTY_SWORD,
  BENT_STAFF,
  SIMPLE_SHIRT,
  BRONZE_SWORD,
  OLD_DAGGER,
  STEEL_SWORD,
  WOODEN_STAFF,
  SIMPLE_ROBE,
  LEATHER_JACKET,
}

export type Equipment = {
  id: number;
  name: string;
  description: string;
  type: EquipmentType;
  subtype: EquipmentSubtype;
  level: number;
  power: number;
  defence: number;
  vitality: number;
  initiative: number;
  price: number;
  warrior: boolean;
  thief: boolean;
  paladin: boolean;
  mage: boolean;
  healer: boolean;
  avatar: string;
  buyingTime: number;
};

export type HeroEquipment = Equipment & { heroId: number };

export const fetchEquipment = () => {
  return query<Equipment[]>("fetchEquipment", "select * from public.equipment", [], mapEquipment);
};

export const withEquipment = async (heroes: Hero[]) => {
  if (heroes.length === 0) {
    return [];
  }

  const equipment = await query<HeroEquipment[]>(
    "withEquipment",
    `select * from public.hero_equipment he
       left join public.equipment e on e.id = he.equipment_id
       where he.hero_id in (${heroes.map((h) => h.id).join(",")})`,
    [],
    mapHeroEquipment
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

export const replaceHeroEquipment = async (heroId: number, prevEquipment: Equipment, equipment: Equipment) => {
  return Promise.all([
    query<void>(
      "replaceEquipment - stats",
      `update public.hero set 
       power = power + $2, 
       defence = defence + $3, 
       vitality = vitality + $4, 
       initiative = initiative + $5 
       where id = $1`,
      [
        heroId,
        equipment.power - prevEquipment.power,
        equipment.defence - prevEquipment.defence,
        equipment.vitality - prevEquipment.vitality,
        equipment.initiative - prevEquipment.initiative,
      ]
    ),
    query<void>(
      "replaceHeroEquipment - equip",
      "update public.hero_equipment set equipment_id = $3 where hero_id = $1 and equipment_id = $2",
      [heroId, prevEquipment.id, equipment.id]
    ),
  ]);
};

export type EquipmentRow = {
  id: string;
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
  thief: boolean;
  paladin: boolean;
  mage: boolean;
  healer: boolean;
  avatar: string;
  buying_time: string;
};

export type HeroEquipmentRow = EquipmentRow & { hero_id: string };

const mapEquipment = (row: EquipmentRow): Equipment => {
  return {
    id: +row.id,
    name: row.name,
    description: row.description,
    type: +row.type,
    subtype: +row.id,
    level: +row.level,
    power: +row.power,
    defence: +row.defence,
    vitality: +row.vitality,
    initiative: +row.initiative,
    price: +row.price,
    warrior: row.warrior,
    thief: row.thief,
    paladin: row.paladin,
    mage: row.mage,
    healer: row.healer,
    avatar: row.avatar,
    buyingTime: +row.buying_time,
  };
};

const mapHeroEquipment = (row: HeroEquipmentRow): HeroEquipment => {
  const equip = mapEquipment(row);
  return {
    ...equip,
    heroId: +row.hero_id,
  };
};
