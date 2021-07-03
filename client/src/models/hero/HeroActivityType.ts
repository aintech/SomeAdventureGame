export enum HeroActivityType {
  IDLE,
  QUEST,
  HEALER,
}

export const activityFromString = (activity: string): HeroActivityType => {
  if (!activity) {
    return HeroActivityType.IDLE;
  }

  switch (activity) {
    case "idle":
      return HeroActivityType.IDLE;
    case "quest":
      return HeroActivityType.QUEST;
    case "healer":
      return HeroActivityType.HEALER;
    default:
      throw new Error(`Unknown hero activity ${activity}`);
  }
};
