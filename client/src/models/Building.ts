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
  ENERGY_HUB,
}

export default class Building {
  constructor(public type: BuildingType, public level: number, public upgrade?: { upgradeStarted?: number; cost: number; duration: number }) {}
}

export const toDisplay = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return "Космогильдия"; // "Гильдия приключений";
    case BuildingType.TAVERN:
      return "Хаб 'Край галактики'"; // "Таверна 'Пьяный жук'";
    case BuildingType.DWELLINGS:
      return "Жилые каюты"; // "Домики жителей";
    case BuildingType.STABLES:
      return "Ангар"; // "Гнездовье канареек";
    case BuildingType.HEALER:
      return "Медцентр"; // "Домик целителя";
    case BuildingType.ELDER:
      return "Администрация"; // "Хижина старейшины";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная база";
    case BuildingType.ALCHEMIST:
      return "Лаборатория"; // "Лаборатория алхимика";
    case BuildingType.BLACKSMITH:
      return "Промзона"; // "Каменная кузня";
    case BuildingType.MARKET:
      return "Маркет"; // "Кибитка торговца";
    case BuildingType.ENERGY_HUB:
      return "Энергогенератор";
    // case BuildingType.DUST_STORAGE:
    //   return "Хранилище пыльцы";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
