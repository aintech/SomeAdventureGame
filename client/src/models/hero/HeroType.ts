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
      return "Гном";
    case HeroType.MAGE:
      return "Фея";
    case HeroType.THIEF:
      return "Эльф";
    case HeroType.HEALER:
      return "Пикси";
    case HeroType.PALADIN:
      return "Сильф";
    default:
      throw new Error(`Unknown hero type ${HeroType[type]}`);
  }
};
