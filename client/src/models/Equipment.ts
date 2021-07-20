import { EquipmentResponse } from "../services/HeroesService";
import { HeroType } from "./hero/HeroType";
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

const collectAvailableHeroTypes = (warrior: boolean, mage: boolean): HeroType[] => {
  const types: HeroType[] = [];
  if (warrior) {
    types.push(HeroType.WARRIOR);
  }
  if (mage) {
    types.push(HeroType.MAGE);
  }
  return types;
};

export const convert = (response: EquipmentResponse): Equipment => {
  return new Equipment(
    +response.id,
    response.name,
    response.description,
    response.type,
    +response.level,
    new PersonageStats(+response.power, +response.defence, +response.vitality, +response.initiative),
    collectAvailableHeroTypes(response.warrior, response.mage),
    response.avatar
  );
};
