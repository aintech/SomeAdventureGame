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
      return "Штурмовик";
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
