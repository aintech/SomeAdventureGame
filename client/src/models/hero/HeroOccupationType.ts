export enum HeroOccupationType {
  IDLE,
  QUEST,
  HEALER,
}

export const occupationFromString = (
  occupation: string
): HeroOccupationType => {
  if (!occupation) {
    return HeroOccupationType.IDLE;
  }

  switch (occupation) {
    case "idle":
      return HeroOccupationType.IDLE;
    case "quest":
      return HeroOccupationType.QUEST;
    case "healer":
      return HeroOccupationType.HEALER;
    default:
      throw new Error(`Unknown hero occupation ${occupation}`);
  }
};
