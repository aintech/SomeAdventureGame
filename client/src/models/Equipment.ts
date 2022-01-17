import { EquipmentResponse } from '../services/HeroService';
import { HeroType } from './hero/HeroType';
import PersonageStats from './PersonageStats';

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

export default class Equipment {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public type: EquipmentType,
    public subtype: EquipmentSubtype,
    public level: number,
    public price: number,
    public stats: PersonageStats,
    public availableTypes: HeroType[],
    public tier: number
  ) {}
}

export const getEquipmentStats = (equipment: Equipment[]): PersonageStats => {
  let power = 0;
  let defence = 0;
  let initiative = 0;
  let wizdom = 0;
  let vitality = 0;

  equipment.forEach((e) => {
    power += e.stats.power;
    defence += e.stats.defence;
    vitality += e.stats.vitality;
    wizdom += e.stats.wizdom;
    initiative -= e.stats.initiative;
  });

  return { power, defence, vitality, wizdom, initiative };
};

const collectAvailableHeroTypes = (response: EquipmentResponse): HeroType[] => {
  const types: HeroType[] = [];
  if (response.warrior) {
    types.push(HeroType.WARRIOR);
  }
  if (response.paladin) {
    types.push(HeroType.PALADIN);
  }
  if (response.thief) {
    types.push(HeroType.THIEF);
  }
  if (response.mage) {
    types.push(HeroType.MAGE);
  }
  if (response.healer) {
    types.push(HeroType.HEALER);
  }
  return types;
};

export const convert = (response: EquipmentResponse): Equipment => {
  return new Equipment(
    response.id,
    response.name,
    response.description,
    response.type,
    response.id,
    response.level,
    response.price,
    new PersonageStats(+response.power, +response.defence, +response.vitality, +response.wizdom, +response.initiative),
    collectAvailableHeroTypes(response),
    response.tier ?? 0
  );
};
