export enum BuildingType {
  GUILD /** Send heroes to quest, Limit number of hired heroes */,
  TAVERN /** Hiring heroes */,
  STABLES /** Limit number of simultaneous embarked quests */,
  HEALER /** Healing heroes */,
  TREASURY /** Management village accounts */,
  TRAINING_GROUND /** Level up heroes */,
  ALCHEMIST /** Selling potions to heroes */,
  TEMPLE /** Buff heroes */,
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
      return "Таверна 'Пьяный вепрь'";
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
      return "Храм Света и Тьмы";
    case BuildingType.BLACKSMITH:
      return "Кузница гномов";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
