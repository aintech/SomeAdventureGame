import { HeroType } from "./Hero";
import PersonageStats from "./PersonageStats";

enum EquipmentType {
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

const convert = (equipmentApiResponse: any): Equipment => {
  return new Equipment(
    +equipmentApiResponse.id,
    equipmentApiResponse.name,
    equipmentApiResponse.description,
    convertType(equipmentApiResponse.type),
    +equipmentApiResponse.level,
    new PersonageStats(
      +equipmentApiResponse.power,
      +equipmentApiResponse.defence,
      +equipmentApiResponse.vitality,
      +equipmentApiResponse.initiative
    ),
    collectAvailableHeroTypes(
      equipmentApiResponse.warrior,
      equipmentApiResponse.mage
    ),
    equipmentApiResponse.avatar
  );
};

export { EquipmentType, convert };
