export enum BuildingType {
  GUILD,
  TAVERN, // MERCENARY_HUB,
  DWELLINGS, // CABINS,
  STABLES, // HANGAR,
  HEALER, // MEDBAY,
  ELDER, // COMMAND_CENTER,
  TRAINING_GROUND,
  ALCHEMIST, // LABORATORY,
  BLACKSMITH, // PRODUCTION_COMPLEX,
  MARKET,
  DUST_STORAGE,
}

export default class Building {
  constructor(public type: BuildingType, public level: number, public upgrade?: { upgradeStarted?: number; cost: number; duration: number }) {}
}

export const toDisplay = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return "Гильдия приключений";
    case BuildingType.TAVERN:
      return "Таверна 'Пьяный жук'";
    case BuildingType.DWELLINGS:
      return "Домики жителей";
    case BuildingType.STABLES:
      return "Гнездовье канареек";
    case BuildingType.HEALER:
      return "Домик целителя";
    case BuildingType.ELDER:
      return "Хижина старейшины";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная площадка";
    case BuildingType.ALCHEMIST:
      return "Лаборатория алхимика";
    case BuildingType.BLACKSMITH:
      return "Каменная кузня";
    case BuildingType.MARKET:
      return "Кибитка торговца";
    case BuildingType.DUST_STORAGE:
      return "Хранилище пыльцы";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
