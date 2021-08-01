export enum HeroType {
  WARRIOR,
  MAGE,
  THIEF,
  HEALER,
  PALADIN,
}

export const display = (type: HeroType) => {
  switch (type) {
    case HeroType.WARRIOR:
      return "Воин";
    case HeroType.MAGE:
      return "Маг";
    case HeroType.THIEF:
      return "Вор";
    case HeroType.HEALER:
      return "Лекарь";
    case HeroType.PALADIN:
      return "Паладин";
    default:
      throw new Error(`Unknown hero type ${HeroType[type]}`);
  }
};

export const fromDisplay = (name: string): HeroType => {
  switch (name) {
    case "Воин":
      return HeroType.WARRIOR;
    case "Маг":
      return HeroType.MAGE;
    case "Вор":
      return HeroType.THIEF;
    case "Лекарь":
      return HeroType.HEALER;
    case "Паладин":
      return HeroType.PALADIN;
    default:
      throw new Error(`Unknown hero type name ${name}`);
  }
};
