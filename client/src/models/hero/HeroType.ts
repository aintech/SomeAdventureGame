export enum HeroType {
  WARRIOR,
  MAGE,
}

export const display = (type: HeroType) => {
  switch (type) {
    case HeroType.WARRIOR:
      return "Воин";
    case HeroType.MAGE:
      return "Маг";
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
    default:
      throw new Error(`Unknown hero type name ${name}`);
  }
};

export const heroTypeFromString = (type: string): HeroType => {
  switch (type) {
    case "warrior":
      return HeroType.WARRIOR;
    case "mage":
      return HeroType.MAGE;
    default:
      throw new Error(`Unknown hero class ${type}`);
  }
};
