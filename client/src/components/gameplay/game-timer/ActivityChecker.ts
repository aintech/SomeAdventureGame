import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import { HEALTH_PER_VITALITY } from "../../../utils/variables";

const checkHeroActivity = (hero: Hero): HeroActivityType | null => {
  if (hero.activity!.type === HeroActivityType.IDLE) {
    if (needHealer(hero)) {
      return HeroActivityType.HEALER;
    }
  } else {
    if (checkActivityEnded(hero)) {
      return HeroActivityType.IDLE;
    }
  }

  return null;
};

const needHealer = (hero: Hero) => {
  return (
    calcHealthFraction(hero) < 1 &&
    hero.gold >= hero.stats.vitality * HEALTH_PER_VITALITY - hero.health
  );
};

const checkActivityEnded = (hero: Hero): boolean => {
  const { activity } = hero;
  if (!activity) {
    return false;
  }
  if (!activity.startedAt || !activity.duration) {
    return false;
  }

  return (
    activity.startedAt.getTime() + activity.duration * 1000 <
    new Date().getTime()
  );
};

export default checkHeroActivity;
