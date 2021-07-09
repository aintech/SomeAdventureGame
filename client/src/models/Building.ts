export enum BuildingType {
  GUILD,
  TAVERN,
  HEALER,
  TREASURY,
}

export default class Building {
  constructor(public id: number, public type: BuildingType) {}
}

export const buildingTypeToName = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return "Гильдия героев";
    case BuildingType.TAVERN:
      return "Таверна 'Пьяный вепрь'";
    case BuildingType.HEALER:
      return "Палатка целителя";
    case BuildingType.TREASURY:
      return "Сокровищница";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
