export enum BuildingType {
  QUEST_BOARD, // GUILD,
  TAVERN, // MERCENARY_HUB,
  DWELLINGS, // CABINS,
  NESTS, // HANGAR, STABLES
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
    case BuildingType.QUEST_BOARD:
      return "Доска заданий";
    case BuildingType.TAVERN:
      return "Таверна 'Пьяный жук'";
    case BuildingType.DWELLINGS:
      return "Домики героев";
    case BuildingType.NESTS:
      return "Гнездовье канареек";
    case BuildingType.HEALER:
      return "Палатка целителя";
    case BuildingType.ELDER:
      return "Домик старейшины";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная площадка";
    case BuildingType.ALCHEMIST:
      return "Лаборатория алхимика";
    case BuildingType.BLACKSMITH:
      return "Кузница Горков";
    case BuildingType.MARKET:
      return "Кибитка торговца";
    case BuildingType.DUST_STORAGE:
      return "Хранилище пыльцы";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
