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
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};

export const description = (type: BuildingType) => {
  switch (type) {
    case BuildingType.GUILD:
      return `В гильдии можно посмотреть текущие задания для героев, а также непосредственно отправить героев на выполнение заданий.
      На одно задание можно послать до 4-х героев.`;
    case BuildingType.TAVERN:
      return `В таверну захаживают герои чтобы отдохнуть и в поисках приключений.
      Здесь их можно нанять себе на службу.
      Чем лучше таверна, тем больше героев в неё забредёт в поисках приключений.`;
    case BuildingType.DWELLINGS:
      return `Каждому герою требуется свой уголок чтобы отдохнуть между заданиями или просто отоспаться после тяжелого дня.
      Количество героев, которых можно нанять в таверне зависит от уровня жилища.`;
    case BuildingType.STABLES:
      return `В Стойлах находятся экипажи с ездовыми животными с помощью которых герои добираются до места выполнения заданий.
      От уровня стойла зависит сколько заданий можно выполнять одновременно.`;
    case BuildingType.HEALER:
      return `В госпитале герои залечивают серьёзные ранения полученные в ходе выполнения заданий.
      Чем выше уровень госпиталя тем быстрее герой вылечится и тем больше героев смогут посетить госпиталь одновременно.`;
    case BuildingType.ELDER:
      return `В хижине старейшины хранится богатсво поселения, ведется подсчёт известности и богаств.`;
    case BuildingType.TRAINING_GROUND:
      return `На тренировочных площадках герои поднимают свой уровень.
      Чем лучше тренировочная, тем быстрее герои поднимают уровень и тем больше героев могут одновременно её посещать.`;
    case BuildingType.ALCHEMIST:
      return `Алхимик продаёт героям разнообразные зелья.
      Чем лучше лавка алхимика, тем больше героев могут закупаться одновременно.`;
    case BuildingType.BLACKSMITH:
      return `Кузнец улучшает оружие и доспехи героев.
      Чем лучше кузница, тем больше героев могут улучшать обмундирование одновременно.`;
    case BuildingType.MARKET:
      return `На Рынке продаётся оружие, доспехи и аксессуары для героев.
      Чем выше уровень рынка, тем больше героев могут закупаться одновременно.`;
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};
