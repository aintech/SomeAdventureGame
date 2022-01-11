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
  constructor(
    public type: BuildingType,
    public level: number,
    public upgrade?: { upgradeStarted?: number; cost: number; duration: number }
  ) {}
}

export const toDisplay = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      // return "Гильдия приключений";
      // return "Космогильдия";
      return 'Гильдия';
    case BuildingType.TAVERN:
      // return "Таверна 'Пьяный жук'";
      // return "Хаб 'Гиперкуб'";
      return 'Бар';
    case BuildingType.DWELLINGS:
      // return "Домики жителей";
      // return "Жилые каюты";
      return 'Жилища';
    case BuildingType.STABLES:
      // return "Гнездовье птиц";
      // return "Ангар";
      return 'Гараж';
    case BuildingType.HEALER:
      // return "Домик целителя";
      // return "Медцентр";
      return 'Госпиталь';
    case BuildingType.ELDER:
      // return "Хижина старейшины";
      // return "Администрация";
      return 'Глава лагеря';
    case BuildingType.TRAINING_GROUND:
      return 'Тренировочная база';
    case BuildingType.ALCHEMIST:
      // return "Лаборатория алхимика";
      return 'Лаборатория';
    case BuildingType.BLACKSMITH:
      return 'Каменная кузня';
    // return "Промзона";
    // return "Рембаза";
    case BuildingType.MARKET:
      // return "Кибитка торговца";
      // return "Маркетплейс";
      return 'Рынок';
    case BuildingType.STORAGE:
      // return "Хранилище пыльцы";
      // return "Энергогенератор";
      return 'Схрон';
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
