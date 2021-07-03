import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";

const checkHeroActivity = (hero: Hero): HeroActivityType | null => {
  if (hero.activity!.type === HeroActivityType.IDLE) {
    if (calcHealthFraction(hero) < 1) {
      return HeroActivityType.HEALER;
    }
  } else {
    if (checkActivityEnded(hero)) {
      return HeroActivityType.IDLE;
    }
  }

  return null;
};

const checkActivityEnded = (hero: Hero): boolean => {
  return false;
};

export default checkHeroActivity;
