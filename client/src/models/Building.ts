export enum BuildingType {
  GUILD /** Send heroes to quest */,
  TAVERN /** Hiring heroes */,
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
    case BuildingType.HEALER:
      return "Палатка целителя";
    case BuildingType.TREASURY:
      return "Сокровищница";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная площадка";
    case BuildingType.ALCHEMIST:
      return "Лавка 'Зелья Мёбиуса'";
    case BuildingType.TEMPLE:
      return "Храм Солнца и Луны";
    case BuildingType.BLACKSMITH:
      return "Кузница братьев Гномс";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
