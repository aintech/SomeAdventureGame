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
      return "Гном"; // "Штурмовик";
    case HeroType.MAGE:
      return "Фея"; // "Техногик";
    case HeroType.THIEF:
      return "Ельф"; // "Агент";
    case HeroType.HEALER:
      return "Пикси"; // "Медик";
    case HeroType.PALADIN:
      return "Сильф"; // "Паладин";
    default:
      throw new Error(`Unknown hero type ${HeroType[type]}`);
  }
};
