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
  STORAGE,
}

export default class Building {
  constructor(public type: BuildingType, public level: number, public upgrade?: { upgradeStarted?: number; cost: number; duration: number }) {}
}

export const toDisplay = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return "Гильдия приключений"; // "Космогильдия";
    case BuildingType.TAVERN:
      return "Таверна 'Пьяный жук'"; // "Хаб 'Край галактики'";
    case BuildingType.DWELLINGS:
      return "Домики жителей"; // "Жилые каюты";
    case BuildingType.STABLES:
      return "Гнездовье птиц"; // "Ангар";
    case BuildingType.HEALER:
      return "Домик целителя"; // "Медцентр";
    case BuildingType.ELDER:
      return "Хижина старейшины"; // "Администрация";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная база";
    case BuildingType.ALCHEMIST:
      return "Лаборатория алхимика"; // "Лаборатория";
    case BuildingType.BLACKSMITH:
      return "Каменная кузня"; // "Промзона";
    case BuildingType.MARKET:
      return "Кибитка торговца"; // "Маркет";
    case BuildingType.STORAGE:
      return "Хранилище пыльцы"; // "Энергогенератор";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
