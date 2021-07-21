import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import { CURE_COST_PER_HP, HEALTH_PER_VITALITY } from "../../../utils/variables";

const checkHeroActivity = (hero: Hero): HeroActivityType | null => {
  if (hero.activity!.type === HeroActivityType.IDLE) {
    if (needHealer(hero)) {
      return HeroActivityType.HEALING;
    }
  } else {
    if (checkActivityEnded(hero)) {
      return HeroActivityType.IDLE;
    }
  }

  return null;
};

const needHealer = (hero: Hero) => {
  const hpLost = hero.stats.vitality * HEALTH_PER_VITALITY - hero.health;
  return hpLost > 0 && hero.gold >= hpLost * CURE_COST_PER_HP;
};

const checkActivityEnded = (hero: Hero): boolean => {
  const { activity } = hero;
  if (!activity) {
    return false;
  }
  if (!activity.startedAt || !activity.duration) {
    return false;
  }

  return activity.startedAt.getTime() + activity.duration * 1000 < new Date().getTime();
};

export default checkHeroActivity;
