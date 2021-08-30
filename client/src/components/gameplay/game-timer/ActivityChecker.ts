import Equipment, { EquipmentType } from "../../../models/Equipment";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivity";
import { HeroType } from "../../../models/hero/HeroType";
import Item, { ItemSubtype } from "../../../models/Item";
import {
  CURE_COST_PER_HP,
  EQUIPMENT_MAX_TIER,
  EQUIPMENT_UPGRADE_COST_FRACTION,
  HEALTH_PER_VITALITY,
  MAX_HEROES_SAME_ACTIVITIES,
} from "../../../utils/variables";

const checkHeroActivity = (
  hero: Hero,
  actualActivities: Map<HeroActivityType, number>,
  market: Equipment[],
  alchemist: Item[]
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
    if (spareActivities(HeroActivityType.UPGRADING_EQUIPMENT, actualActivities) && upgradingEquipment(hero)) {
      return HeroActivityType.UPGRADING_EQUIPMENT;
    }
    if (spareActivities(HeroActivityType.PURCHASING_POTIONS, actualActivities) && buyPotions(hero, alchemist)) {
      return HeroActivityType.PURCHASING_POTIONS;
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
  const weapon = hero.equipment.find((e) => e.type === EquipmentType.WEAPON)!;
  const newWeapon = market.find(
    (e) => appropriateEquipment(hero, EquipmentType.WEAPON, e) && e.level === weapon.level + 1
  );
  if ((newWeapon?.price ?? Number.MAX_SAFE_INTEGER) <= hero.gold) {
    return true;
  }

  const armor = hero.equipment.find((e) => e.type === EquipmentType.ARMOR)!;
  const newArmor = market.find(
    (e) => appropriateEquipment(hero, EquipmentType.ARMOR, e) && e.level === armor.level + 1
  );
  if ((newArmor?.price ?? Number.MAX_SAFE_INTEGER) <= hero.gold) {
    return true;
  }

  return false;
};

const appropriateEquipment = (hero: Hero, type: EquipmentType, equipment: Equipment) => {
  return equipment.availableTypes.includes(hero.type) && equipment.type === type;
};

const upgradingEquipment = (hero: Hero) => {
  let readyToUpdate = false;
  hero.equipment.forEach((e) => {
    if (e.tier < EQUIPMENT_MAX_TIER) {
      readyToUpdate = readyToUpdate || hero.gold >= Math.floor(e.price * EQUIPMENT_UPGRADE_COST_FRACTION);
    }
  });
  return readyToUpdate;
};

const buyPotions = (hero: Hero, alchemist: Item[]) => {
  if (alchemist.length === 0) {
    return false;
  }

  const healingPotion = alchemist.find((i) => i.subtype === ItemSubtype.HEALTH_POTION)!;
  const healingElixir = alchemist.find((i) => i.subtype === ItemSubtype.HEALTH_ELIXIR)!;
  const manaPotion = alchemist.find((i) => i.subtype === ItemSubtype.MANA_POTION)!;

  let heroPotions = hero.items.find((i) => i.subtype === ItemSubtype.HEALTH_POTION);

  if (!heroPotions && healingPotion.price <= hero.gold) {
    return true;
  }

  if (heroPotions) {
    if (heroPotions.amount < 3) {
      return healingPotion.price <= hero.gold;
    }
  }

  if (hero.type === HeroType.MAGE || hero.type === HeroType.HEALER) {
    heroPotions = hero.items.find((i) => i.subtype === ItemSubtype.MANA_POTION);
    if (!heroPotions && manaPotion.price <= hero.gold) {
      return true;
    }
    if (heroPotions) {
      if (heroPotions.amount < 3) {
        return manaPotion.price <= hero.gold;
      }
    }
  } else {
    heroPotions = hero.items.find((i) => i.subtype === ItemSubtype.HEALTH_ELIXIR);
    if (!heroPotions && healingElixir.price <= hero.gold) {
      return true;
    }
    if (heroPotions) {
      if (heroPotions.amount < 3) {
        return healingElixir.price <= hero.gold;
      }
    }
  }

  return false;
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
