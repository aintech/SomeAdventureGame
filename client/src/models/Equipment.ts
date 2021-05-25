import { EquipmentResponse } from "../services/HeroesService";
import { HeroType } from "./Hero";
import PersonageStats from "./PersonageStats";

export enum EquipmentType {
  WEAPON,
  ARMOR,
  SHIELD,
  ACCESSORY,
}

export default class Equipment {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public type: EquipmentType,
    public level: number,
    public stats: PersonageStats,
    public availableTypes: HeroType[],
    public imgAvatar: string
  ) {}
}

const convertType = (type: string): EquipmentType => {
  switch (type) {
    case "weapon":
      return EquipmentType.WEAPON;
    case "armor":
      return EquipmentType.ARMOR;
    case "shield":
      return EquipmentType.SHIELD;
    case "accessory":
      return EquipmentType.ACCESSORY;
    default:
      throw new Error(`Unknown equipment type ${type}`);
  }
};

const collectAvailableHeroTypes = (
  warrior: boolean,
  mage: boolean
): HeroType[] => {
  const types: HeroType[] = [];
  if (warrior) {
    types.push(HeroType.WARRIOR);
  }
  if (mage) {
    types.push(HeroType.MAGE);
  }
  return types;
};

const convert = (response: EquipmentResponse): Equipment => {
  return new Equipment(
    +response.id,
    response.name,
    response.description,
    convertType(response.type),
    +response.level,
    new PersonageStats(
      +response.power,
      +response.defence,
      +response.vitality,
      +response.initiative
    ),
    collectAvailableHeroTypes(response.warrior, response.mage),
    response.avatar
  );
};

export { convert };
