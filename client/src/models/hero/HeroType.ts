export enum HeroType {
  WARRIOR, // GNOME, TROOPER
  MAGE, // FAIRY, TECHNOMANCER
  THIEF, // ELF, AGENT
  HEALER, // PIXIE, MEDIC
  PALADIN, // SYLPH
}

export const display = (type: HeroType) => {
  switch (type) {
    case HeroType.WARRIOR:
      return "Штурмовик";
    case HeroType.MAGE:
      return "Техногик";
    case HeroType.THIEF:
      return "Агент";
    case HeroType.HEALER:
      return "Медик";
    case HeroType.PALADIN:
      return "Паладин";
    default:
      throw new Error(`Unknown hero type ${HeroType[type]}`);
  }
};
