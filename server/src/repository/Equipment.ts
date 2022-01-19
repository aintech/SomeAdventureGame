import query, { single } from './Db';
import { HeroWithEquipment, Hero } from './hero/Hero';

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

export type EquipmentStats = {
  power: number;
  defence: number;
  vitality: number;
  wizdom: number;
  initiative: number;
};

export type Equipment = EquipmentStats & {
  id: number;
  name: string;
  description: string;
  type: EquipmentType;
  subtype: EquipmentSubtype;
  level: number;
  price: number;
  warrior: boolean;
  thief: boolean;
  mage: boolean;
  healer: boolean;
  buyingTime: number;
  tier: number;
};

export type HeroEquipment = Equipment & { heroId: number };

export type HeroEquipmentLink = {
  heroId: number;
  equipmentId: number;
  tier: number;
};

export const getEquipmentStats = (equipment: Equipment[]): EquipmentStats => {
  let power = 0;
  let defence = 0;
  let initiative = 0;
  let wizdom = 0;
  let vitality = 0;

  equipment.forEach((e) => {
    power += e.power;
    defence += e.defence;
    vitality += e.vitality;
    wizdom += e.wizdom;
    initiative += e.initiative;
  });

  return { power, defence, vitality, wizdom, initiative };
};

export const fetchEquipment = (tier: number = 0) => {
  return query<Equipment[]>(
    'fetchEquipment',
    `select * from public.equipment equip 
     left join public.equipment_tier tier on equip.id = tier.equipment_id and tier.tier = $1`,
    [tier],
    mapEquipment
  );
};

export const getHeroEquipmentLink = (heroid: number, equipmentId: number) => {
  return query<HeroEquipmentLink>(
    'getEquipment',
    `select * from public.hero_equipment where hero_id = $1 and equipment_id = $2`,
    [heroid, equipmentId],
    (row: { hero_id: string; equipment_id: string; tier: string }) => {
      return {
        heroId: +row.hero_id,
        equipmentId: +row.equipment_id,
        tier: +row.tier,
      };
    },
    single
  );
};

export const withEquipment = async (heroes: Hero[]) => {
  if (heroes.length === 0) {
    return [];
  }

  const equipment = await query<HeroEquipment[]>(
    'withEquipment',
    `select * from public.hero_equipment he
     left join public.equipment e on e.id = he.equipment_id
     left join public.equipment_tier tier on he.equipment_id = tier.equipment_id and tier.tier = he.tier
     where he.hero_id in (${heroes.map((h) => h.id).join(',')})`,
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
      'replaceHeroEquipment - equip',
      'update public.hero_equipment set equipment_id = $3, tier = $4 where hero_id = $1 and equipment_id = $2',
      [heroId, prevEquipment.id, equipment.id, equipment.tier]
    ),
  ]);
};

export const changeHeroEquipmentTier = async (heroId: number, equipmentId: number, tier: number) => {
  return query<void>('changeHeroEquipmentTier', `update public.hero_equipment set tier = $3 where hero_id = $1 and equipment_id = $2`, [
    heroId,
    equipmentId,
    tier,
  ]);
};

export type EquipmentRow = {
  id: string;
  name: string;
  description: string;
  type: string;
  level: string;
  price: string;
  warrior: boolean;
  thief: boolean;
  mage: boolean;
  healer: boolean;
  buying_time: string;
  tier: string;
  power: string;
  defence: string;
  vitality: string;
  wizdom: string;
  initiative: string;
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
    price: +row.price,
    warrior: row.warrior,
    thief: row.thief,
    mage: row.mage,
    healer: row.healer,
    buyingTime: +row.buying_time,
    tier: +row.tier,
    power: +row.power,
    defence: +row.defence,
    vitality: +row.vitality,
    wizdom: +row.wizdom,
    initiative: +row.initiative,
  };
};

const mapHeroEquipment = (row: HeroEquipmentRow): HeroEquipment => {
  const equip = mapEquipment(row);
  return {
    ...equip,
    heroId: +row.hero_id,
  };
};
