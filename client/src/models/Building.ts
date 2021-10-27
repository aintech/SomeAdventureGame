export enum BuildingType {
  GUILD,
  TAVERN,
  STABLES,
  HEALER,
  TREASURY,
  TRAINING_GROUND,
  ALCHEMIST,
  TEMPLE,
  BLACKSMITH,
  STORAGE,
  MARKET,
  ELDER,
}

export default class Building {
  constructor(public type: BuildingType, public level: number, public upgrade?: { upgradeStarted?: number; cost: number; duration: number }) {}
}

export const toDisplay = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return "Гильдия героев";
    case BuildingType.TAVERN:
      return "Таверна 'Пьяный кузнечик'";
    case BuildingType.STABLES:
      return "Конюшни";
    case BuildingType.HEALER:
      return "Палатка целителя";
    case BuildingType.TREASURY:
      return "Сокровищница";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная площадка";
    case BuildingType.ALCHEMIST:
      return "Лаборатория алхимика";
    case BuildingType.TEMPLE:
      return "Храм бабочек";
    case BuildingType.BLACKSMITH:
      return "Кузница гномов";
    case BuildingType.STORAGE:
      return "Хранилище";
    case BuildingType.MARKET:
      return "Кибитка торговца";
    case BuildingType.ELDER:
      return "Старейшена";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
