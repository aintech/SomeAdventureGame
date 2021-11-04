export enum BuildingType {
  GUILD_OFFICE, // GUILD,
  MERCENARY_HUB, // TAVERN,
  CABINS,
  HANGAR, // STABLES,
  MEDBAY, // HEALER,
  COMMAND_CENTER, // TREASURY,
  TRAINING_GROUND,
  LABORATORY, // ALCHEMIST,
  PRODUCTION_COMPLEX, // BLACKSMITH,
  STORAGE,
  MARKET,
  POWER_STATION,
}

export default class Building {
  constructor(public type: BuildingType, public level: number, public upgrade?: { upgradeStarted?: number; cost: number; duration: number }) {}
}

export const toDisplay = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD_OFFICE:
      return "Офис гильдии";
    case BuildingType.MERCENARY_HUB:
      return "Хаб наёмников";
    case BuildingType.CABINS:
      return "Каюты";
    case BuildingType.HANGAR:
      return "Ангар";
    case BuildingType.MEDBAY:
      return "Медцентр";
    case BuildingType.COMMAND_CENTER:
      return "Командный центр";
    case BuildingType.TRAINING_GROUND:
      return "Тренировочная площадка";
    case BuildingType.LABORATORY:
      return "Лаборатория";
    case BuildingType.PRODUCTION_COMPLEX:
      return "Промышленный комплекс";
    case BuildingType.STORAGE:
      return "Склад";
    case BuildingType.MARKET:
      return "Торговая площадка";
    case BuildingType.POWER_STATION:
      return "Энергоустановка";
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};

// export const toDisplay = (type: BuildingType) => {
//   switch (type) {
//     case BuildingType.GUILD:
//       return "Гильдия героев";
//     case BuildingType.TAVERN:
//       return "Таверна 'Пьяный кузнечик'";
//     case BuildingType.STABLES:
//       return "Конюшни";
//     case BuildingType.HEALER:
//       return "Палатка целителя";
//     case BuildingType.TREASURY:
//       return "Сокровищница";
//     case BuildingType.TRAINING_GROUND:
//       return "Тренировочная площадка";
//     case BuildingType.ALCHEMIST:
//       return "Лаборатория алхимика";
//     case BuildingType.BLACKSMITH:
//       return "Кузница гномов";
//     case BuildingType.STORAGE:
//       return "Хранилище";
//     case BuildingType.MARKET:
//       return "Кибитка торговца";
//     case BuildingType.ELDER:
//       return "Старейшена";
//     default:
//       throw new Error(`Unknown building type ${BuildingType[type]}`);
//   }
// };
