export enum BuildingType {
  GUILD /** Send heroes to quest */,
  TAVERN /** Hiring heroes */,
  DWELLING /** Limit number of hired heroes at the same time */,
  BEETLE_CAMP /** Limit number of simultaneous embarked quests */,
  HEALER /** Healing heroes */,
  TREASURY /** Management village accounts */,
  TRAINING_GROUND /** Level up heroes */,
  ALCHEMIST /** Selling potions to heroes */,
  SHAMAN /** Buff heroes */,
  BLACKSMITH /** Upgrade heroes equipment*/,
}

export default class Building {
  constructor(public id: number, public type: BuildingType) {}
}

export const buildingTypeToName = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return "Гильдия героев";
    case BuildingType.TAVERN:
      return "Таверна 'Пьяная мушка'";
    case BuildingType.DWELLING:
      return "Жилище";
    case BuildingType.BEETLE_CAMP:
      return "Стоянка жуков";
    case BuildingType.HEALER:
      return "Палатка целителя";
    case BuildingType.TREASURY:
      return "Сокровищница";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная площадка";
    case BuildingType.ALCHEMIST:
      return "Грибочек алхимика";
    case BuildingType.SHAMAN:
      return "Хибарка шамана";
    case BuildingType.BLACKSMITH:
      return "Кузница Гномсов";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
