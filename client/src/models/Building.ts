export enum BuildingType {
  GUILD,
  TAVERN,
  DWELLINGS,
  STABLES,
  HEALER,
  ELDER,
  TRAINING_GROUND,
  ALCHEMIST,
  BLACKSMITH,
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
      return 'Гильдия';
    case BuildingType.TAVERN:
      return 'Таверна';
    case BuildingType.DWELLINGS:
      return 'Жилища';
    case BuildingType.STABLES:
      return 'Стойла';
    case BuildingType.HEALER:
      return 'Госпиталь';
    case BuildingType.ELDER:
      return 'Старейшина';
    case BuildingType.TRAINING_GROUND:
      return 'Тренировочная';
    case BuildingType.ALCHEMIST:
      return 'Алхимик';
    case BuildingType.BLACKSMITH:
      return 'Кузница';
    case BuildingType.MARKET:
      return 'Рынок';
    case BuildingType.STORAGE:
      return 'Сокровищница';
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
