import {
  CURE_COST_PER_HP,
  EQUIPMENT_MAX_TIER,
  EQUIPMENT_UPGRADE_COST_FRACTION,
  HEALTH_PER_VITALITY,
  MAX_HEROES_SAME_ACTIVITIES,
} from "../../utils/Variables";
import query from "../Db";
import {
  changeHeroEquipmentTier,
  Equipment,
  EquipmentType,
  getEquipmentStats,
  getHeroEquipmentLink,
  replaceHeroEquipment,
} from "../Equipment";
import { adjustHeroGold, getHeroesByIds, HeroType, HeroWithPerks, setHeroHealth, updateHeroLevel } from "../hero/Hero";
import { adjustItems, Item, ItemSubtype } from "../Item";
import { getAlchemistAssortment, getMarketAssortment } from "../ShopsAssortment";
import { addStats } from "../Stats";
import { getLevelExp } from "./Level";

export enum HeroActivityType {
  IDLE,
  QUEST,
  HEALING,
  TRAINING,
  PURCHASING_EQUIPMENT,
  PURCHASING_POTIONS,
  PRAYING,
  UPGRADING_EQUIPMENT,
}

export type HeroActivity = {
  heroId: number;
  type: HeroActivityType;
  description: string;
  startedAt: Date;
  activityId?: number;
  duration?: number;
};

type HeroActivityUpdate = {
  heroId: number;
  type: HeroActivityType;
  description: string;
  activityId?: number;
  duration?: number;
};

export const updateHeroActivities = async (userId: number, heroActivities: HeroActivityUpdate[]) => {
  const heroIds = heroActivities.map((a) => a.heroId);
  const heroes = await getHeroesByIds(heroIds);

  for (const heroActivity of heroActivities) {
    const hero = heroes.filter((h) => +h.id === +heroActivity.heroId)[0];
    let enrichedActivity = heroActivity;

    if (heroActivity.type !== HeroActivityType.IDLE && heroActivity.type !== HeroActivityType.QUEST) {
      const actualActivities = await countActivities(userId);
      const sameActivities = actualActivities.find((a) => a.type === heroActivity.type)?.count ?? 0;
      if (sameActivities >= MAX_HEROES_SAME_ACTIVITIES) {
        continue;
      }
    }

    switch (heroActivity.type) {
      case HeroActivityType.IDLE:
        enrichedActivity = await toIdle(userId, hero, heroActivity);
        break;
      case HeroActivityType.QUEST:
        //all done in embark to quest methods
        break;
      case HeroActivityType.HEALING:
        enrichedActivity = await idleToHealing(userId, hero, heroActivity);
        break;
      case HeroActivityType.TRAINING:
        enrichedActivity = await idleToTraining(userId, hero, heroActivity);
        break;
      case HeroActivityType.PURCHASING_EQUIPMENT:
        enrichedActivity = await idleToPurchasingEquipment(userId, hero, heroActivity);
        break;
      case HeroActivityType.PURCHASING_POTIONS:
        enrichedActivity = await idleToPurchasingPotions(userId, hero, heroActivity);
        break;
      case HeroActivityType.UPGRADING_EQUIPMENT:
        enrichedActivity = await idleToUpgradingEquipment(userId, hero, heroActivity);
        break;
      default:
        throw new Error(`Unknown activity type for update ${heroActivity.type}`);
    }
    await updateHeroActivity(hero.id, enrichedActivity);
  }

  return getHeroesByIds(heroIds);
};

const toIdle = async (userId: number, hero: HeroWithPerks, heroActivity: HeroActivityUpdate) => {
  if (!hero.activity) {
    throw new Error(`Activity not found while switching to idle for hero ${hero.id}`);
  }

  if (!hero.activity.duration) {
    throw new Error(`Activity without duration while switching to idle for hero ${hero.id}`);
  }

  /** additional 1000 ms just in case */
  if (hero.activity.startedAt.getTime() + hero.activity.duration * 1000 >= new Date().getTime() + 1000) {
    throw new Error(`Activity not complete yet while switching to idle for hero ${hero.id}`);
  }

  let maxHealth = 0;
  switch (hero.activity.type) {
    case HeroActivityType.QUEST:
      //all done in complete quest methods
      break;
    case HeroActivityType.HEALING:
      //setting max health
      maxHealth = (hero.vitality + getEquipmentStats(hero.equipment).vitality) * HEALTH_PER_VITALITY;
      await setHeroHealth(hero.id, maxHealth);
      break;
    case HeroActivityType.TRAINING:
      const power = Math.floor(Math.random() * 6) + 5;
      const vitality = Math.floor(Math.random() * (hero.type === HeroType.MAGE || HeroType.HEALER ? 2 : 6)) + 3;
      maxHealth = (vitality + getEquipmentStats(hero.equipment).vitality) * HEALTH_PER_VITALITY;
      await updateHeroLevel(hero.id, hero.level.lvl + 1, power, vitality);
      await setHeroHealth(hero.id, maxHealth);
      break;
    case HeroActivityType.PURCHASING_EQUIPMENT:
      const marketAssort = await getMarketAssortment(userId);
      const newHeroEquip = marketAssort.find((a) => a.id === hero.activity!.activityId)!;
      const replacedEquip = hero.equipment.find((e) => e.type === newHeroEquip.type)!;
      await replaceHeroEquipment(hero.id, replacedEquip, newHeroEquip);
      break;
    case HeroActivityType.PURCHASING_POTIONS:
      await adjustItems(hero.id, hero.activity.activityId!, 1);
      break;
    case HeroActivityType.UPGRADING_EQUIPMENT:
      const equipment = await getHeroEquipmentLink(hero.id, hero.activity.activityId!);
      if (equipment.tier === EQUIPMENT_MAX_TIER) {
        throw new Error(`Trying to upgrade equipment past maximum tier!`);
      }
      await changeHeroEquipmentTier(hero.id, hero.activity.activityId!, equipment.tier + 1);
      break;
    default:
      throw new Error(`Unknown activity type ${hero.activity!.type}`);
  }

  return {
    ...heroActivity,
    description: "Не при делах",
  };
};

const idleToHealing = async (
  userId: number,
  hero: HeroWithPerks,
  heroActivity: HeroActivityUpdate
): Promise<HeroActivityUpdate> => {
  const hpLoss = hero.vitality * HEALTH_PER_VITALITY - hero.health;
  const cost = hpLoss * CURE_COST_PER_HP;

  if (cost > hero.gold) {
    throw new Error(`Not enought gold for healing!`);
  }

  await Promise.all([adjustHeroGold(hero.id, -cost), addStats(userId, cost)]);

  return {
    ...heroActivity,
    duration: hpLoss * 5,
    description: "Отдыхает в палатке целителя",
  };
};

const idleToTraining = async (
  userId: number,
  hero: HeroWithPerks,
  heroActivity: HeroActivityUpdate
): Promise<HeroActivityUpdate> => {
  const nextLevel = getLevelExp(hero.level.lvl + 1);

  if (nextLevel.cost > hero.gold) {
    throw new Error(`Not enought gold for level up!`);
  }
  if (hero.level.experience < nextLevel.experience) {
    throw new ErrorEvent(`Not enought experience for level up!`);
  }

  await Promise.all([adjustHeroGold(hero.id, -nextLevel.cost), addStats(userId, nextLevel.cost)]);

  return {
    ...heroActivity,
    duration: nextLevel.duration,
    description: `Тренирует ${nextLevel.level} уровень`,
  };
};

const idleToPurchasingEquipment = async (
  userId: number,
  hero: HeroWithPerks,
  heroActivity: HeroActivityUpdate
): Promise<HeroActivityUpdate> => {
  const assortment = await getMarketAssortment(userId);

  let purchase: Equipment | undefined;

  const weapon = hero.equipment.filter((e) => e.type === EquipmentType.WEAPON)[0];
  const newWeapon = assortment.filter(
    (e) => appropriateEquipment(hero, EquipmentType.WEAPON, e) && e.level === weapon.level + 1
  );
  if (newWeapon.length > 0) {
    if (newWeapon[0].price <= hero.gold) {
      purchase = newWeapon[0];
    }
  }

  if (!purchase) {
    const armor = hero.equipment.filter((e) => e.type === EquipmentType.ARMOR)[0];
    const newArmor = assortment.filter(
      (e) => appropriateEquipment(hero, EquipmentType.ARMOR, e) && e.level === armor.level + 1
    );
    if (newArmor.length > 0) {
      if (newArmor[0].price <= hero.gold) {
        purchase = newArmor[0];
      }
    }
  }

  if (!purchase) {
    throw new Error(`Unable to find equipment to purchase for hero ${hero.id}!`);
  }

  await Promise.all([adjustHeroGold(hero.id, -purchase.price), addStats(userId, purchase.price)]);

  return {
    ...heroActivity,
    duration: purchase.buyingTime,
    activityId: purchase.id,
    description: `Покупает ${purchase.name} на рынке`,
  };
};

const appropriateEquipment = (hero: HeroWithPerks, type: EquipmentType, equipment: Equipment) => {
  return (
    equipment.type === type &&
    ((equipment.warrior && hero.type === HeroType.WARRIOR) ||
      (equipment.thief && hero.type === HeroType.THIEF) ||
      (equipment.paladin && hero.type === HeroType.PALADIN) ||
      (equipment.mage && hero.type === HeroType.MAGE) ||
      (equipment.healer && hero.type === HeroType.HEALER))
  );
};

const idleToPurchasingPotions = async (
  userId: number,
  hero: HeroWithPerks,
  heroActivity: HeroActivityUpdate
): Promise<HeroActivityUpdate> => {
  let potion: Item | undefined;

  const assortment = await getAlchemistAssortment(userId);

  const healingPotion = assortment.find((i) => i.subtype === ItemSubtype.HEALTH_POTION)!;
  const healingElixir = assortment.find((i) => i.subtype === ItemSubtype.HEALTH_ELIXIR)!;
  const manaPotion = assortment.find((i) => i.subtype === ItemSubtype.MANA_POTION)!;

  let possiblePotion = hero.items.find((i) => i.subtype === ItemSubtype.HEALTH_POTION);

  if (!possiblePotion && healingPotion.price <= hero.gold) {
    potion = healingPotion;
  }

  if (!potion && possiblePotion) {
    if (possiblePotion.amount < 3 && healingPotion.price <= hero.gold) {
      potion = healingPotion;
    }
  }

  if (!potion) {
    if (hero.type === HeroType.MAGE || hero.type === HeroType.HEALER) {
      possiblePotion = hero.items.find((i) => i.subtype === ItemSubtype.MANA_POTION);
      if (!possiblePotion && manaPotion.price <= hero.gold) {
        potion = manaPotion;
      }
      if (!potion && possiblePotion) {
        if (possiblePotion.amount < 3 && manaPotion.price <= hero.gold) {
          potion = manaPotion;
        }
      }
    } else {
      possiblePotion = hero.items.find((i) => i.subtype === ItemSubtype.HEALTH_ELIXIR);
      if (!possiblePotion && healingElixir.price <= hero.gold) {
        potion = healingElixir;
      }
      if (!potion && possiblePotion) {
        if (possiblePotion.amount < 3 && healingElixir.price <= hero.gold) {
          potion = healingElixir;
        }
      }
    }
  }

  if (!potion) {
    throw new Error(`Unable to find potion to buy for hero ${hero.id}`);
  }

  await Promise.all([adjustHeroGold(hero.id, -potion.price), addStats(userId, potion.price)]);

  return {
    ...heroActivity,
    duration: potion.buyingTime,
    activityId: potion.id,
    description: `Покупает ${potion.name} у алхимика`,
  };
};

const idleToUpgradingEquipment = async (
  userId: number,
  hero: HeroWithPerks,
  heroActivity: HeroActivityUpdate
): Promise<HeroActivityUpdate> => {
  let equipment: Equipment | undefined;

  hero.equipment.forEach((e) => {
    if (e.tier < EQUIPMENT_MAX_TIER) {
      if (hero.gold >= Math.floor(e.price * EQUIPMENT_UPGRADE_COST_FRACTION)) {
        equipment = e;
      }
    }
  });

  if (!equipment) {
    throw new Error(`Unable to find equipment for upgrading for hero ${hero.id}`);
  }

  const cost = Math.floor(equipment.price * EQUIPMENT_UPGRADE_COST_FRACTION);

  await Promise.all([adjustHeroGold(hero.id, -cost), addStats(userId, cost)]);

  return {
    ...heroActivity,
    duration: equipment.buyingTime,
    activityId: equipment.id,
    description: `Улучшает ${equipment.name} в кузнице`,
  };
};

const updateHeroActivity = async (heroId: number, activity: HeroActivityUpdate) => {
  await query<void>(
    "updateHeroActivity",
    `update public.hero_activity set 
     activity_type = ${activity.type}, 
     description = '${activity.description}',
     activity_id = ${activity.activityId ?? null}, 
     duration = ${activity.duration ?? null},
     started_at = now() 
     where hero_id = $1`,
    [heroId]
  );
};

const countActivities = async (userId: number) => {
  return query<{ type: HeroActivityType; count: number }[]>(
    "countHeroActivities",
    `select ha.activity_type, count(*) 
     from public.hero h left join public.hero_activity ha on ha.hero_id = h.id 
     where h.user_id = $1 and ha.activity_type > 0 group by ha.activity_type`,
    [userId],
    (row: any) => {
      return {
        type: +row.activity_type,
        count: +row.count,
      };
    }
  );
};
