import Equipment, { EquipmentType } from "../../../models/Equipment";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import { CURE_COST_PER_HP, HEALTH_PER_VITALITY, MAX_HEROES_SAME_ACTIVITIES } from "../../../utils/variables";

const checkHeroActivity = (
  hero: Hero,
  actualActivities: Map<HeroActivityType, number>,
  market: Equipment[]
): HeroActivityType | null => {
  if (hero.activity!.type === HeroActivityType.IDLE) {
    if (spareActivities(HeroActivityType.HEALING, actualActivities) && needHealer(hero)) {
      return HeroActivityType.HEALING;
    }
    if (spareActivities(HeroActivityType.TRAINING, actualActivities) && readyToLevelUp(hero)) {
      return HeroActivityType.TRAINING;
    }
    if (spareActivities(HeroActivityType.PURCHASING_EQUIPMENT, actualActivities) && buyEquipment(hero, market)) {
      return HeroActivityType.PURCHASING_EQUIPMENT;
    }
  } else {
    if (checkActivityEnded(hero)) {
      return HeroActivityType.IDLE;
    }
  }

  return null;
};

const spareActivities = (type: HeroActivityType, actualActivities: Map<HeroActivityType, number>) => {
  return (actualActivities.get(type) ?? 0) < MAX_HEROES_SAME_ACTIVITIES;
};

const needHealer = (hero: Hero) => {
  const hpLost = hero.stats.vitality * HEALTH_PER_VITALITY - hero.health;
  return hpLost > 0 && hero.gold >= hpLost * CURE_COST_PER_HP;
};

const readyToLevelUp = (hero: Hero) => {
  return hero.level.levelUp?.cost <= hero.gold;
};

const buyEquipment = (hero: Hero, market: Equipment[]) => {
  const weapon = hero.equipment.filter((e) => e.type === EquipmentType.WEAPON)[0];
  const newWeapon = market.filter(
    (e) => appropriateEquipment(hero, EquipmentType.WEAPON, e) && e.level === weapon.level + 1
  );
  if (newWeapon.length > 0) {
    if (newWeapon[0].price <= hero.gold) {
      return true;
    }
  }

  const armor = hero.equipment.filter((e) => e.type === EquipmentType.ARMOR)[0];
  const newArmor = market.filter(
    (e) => appropriateEquipment(hero, EquipmentType.ARMOR, e) && e.level === armor.level + 1
  );
  if (newArmor.length > 0) {
    if (newArmor[0].price <= hero.gold) {
      return true;
    }
  }

  return false;
};

const appropriateEquipment = (hero: Hero, type: EquipmentType, equipment: Equipment) => {
  return equipment.availableTypes.includes(hero.type) && equipment.type === type;
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
