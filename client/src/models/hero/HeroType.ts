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
      return "Штурмовик"; // "Гном";
    case HeroType.MAGE:
      return "Псионик"; // "Фея"; // "Техногик";
    case HeroType.THIEF:
      return "Агент"; // "Ельф";
    case HeroType.HEALER:
      return "Медик"; // "Пикси";
    case HeroType.PALADIN:
      // Сила прибитого
      return "Паладин"; // "Сильф";
    default:
      throw new Error(`Unknown hero type ${HeroType[type]}`);
  }
};
