import { getEquipmentStats } from "../repository/Equipment";
import { HeroWithItems, HeroWithSkills } from "../repository/hero/Hero";
import { HeroItem, Item, ItemSubtype, ItemType } from "../repository/Item";
import { Monster } from "../repository/Monster";
import { anyOf, copy } from "../utils/Arrays";
import { HEALTH_PER_VITALITY } from "../utils/Variables";

enum ActorType {
  HERO,
  MONSTER,
}

type Actor = {
  id: number;
  health: number;
  power: number;
  defence: number;
  initiative: number;
  type: ActorType;
  actorId?: number /** actual for monster */;
  vitality?: number /** actual for hero */;
  items?: HeroItem[] /** actual for hero */;
};

export enum BattleStepActionType {
  HERO_ATTACK,
  ENEMY_ATTACK,
  USE_POTION,
}

export type BattleStep = {
  heroId: number;
  action: BattleStepActionType;
  enemyId?: number;
  itemId?: number;
  damage?: number;
};

const mapActor = (actor: HeroWithSkills | Monster, type: ActorType): Actor => {
  const equipStats = getEquipmentStats(type === ActorType.MONSTER ? [] : (actor as HeroWithSkills).equipment);
  return {
    id: actor.id,
    health: actor.health,
    power: actor.power + equipStats.power,
    defence: actor.defence + equipStats.defence,
    initiative: actor.initiative + equipStats.initiative,
    actorId: type === ActorType.MONSTER ? (actor as Monster).actorId : undefined,
    vitality: type === ActorType.HERO ? (actor as HeroWithItems).vitality + equipStats.vitality : undefined,
    items: type === ActorType.HERO ? (actor as HeroWithItems).items : undefined,
    type,
  };
};

const getBattleSteps = (origMonsters: Monster[], origHeroes: HeroWithSkills[]) => {
  const monsters = (copy(origMonsters) as Monster[]).map((a) => mapActor(a, ActorType.MONSTER));
  const heroes = (copy(origHeroes) as HeroWithSkills[]).map((a) => mapActor(a, ActorType.HERO));

  const battleSteps = new Map<number, BattleStep[]>();
  for (let sec = 1; ; sec++) {
    battleSteps.set(sec, []);

    for (const hero of heroes) {
      defineStep(sec, hero, monsters, battleSteps);
      if (partyDefeated(monsters)) {
        return removeEmptySteps(battleSteps);
      }
    }

    for (const monster of monsters) {
      defineStep(sec, monster, heroes, battleSteps);
      if (partyDefeated(heroes)) {
        return removeEmptySteps(battleSteps);
      }
    }

    if (partyDefeated(monsters) || partyDefeated(heroes)) {
      return removeEmptySteps(battleSteps);
    }
  }
};

const defineStep = (sec: number, actor: Actor, opponents: Actor[], battleSteps: Map<number, BattleStep[]>) => {
  if (sec % actor.initiative === 0) {
    let usePotion;

    if (actor.type === ActorType.HERO) {
      if (lowHealth(actor)) {
        const step = potionStep(actor);
        if (step) {
          battleSteps.get(sec)!.push(step);
          actor.health = actor.vitality! * HEALTH_PER_VITALITY;
          usePotion = true;
        }
      }
    }

    if (!usePotion) {
      battleSteps.get(sec)!.push(attackStep(actor, opponents));
    }
  }
};

const attackStep = (actor: Actor, opponents: Actor[]) => {
  const aliveOpponents = opponents.filter((o) => +o.health > 0);
  const opponent = anyOf(aliveOpponents);
  const damage = Math.max(+actor.power - +opponent.defence, 0);
  opponent.health -= damage;

  const result: BattleStep = {
    heroId: actor.type === ActorType.HERO ? actor.id : opponent.id,
    enemyId: actor.type === ActorType.MONSTER ? actor.actorId : opponent.actorId,
    action: actor.type === ActorType.HERO ? BattleStepActionType.HERO_ATTACK : BattleStepActionType.ENEMY_ATTACK,
    damage,
  };

  return result;
};

const potionStep = (actor: Actor): BattleStep | null => {
  const items = actor.items!;
  if (items.length > 0) {
    let potions = items.filter((i) => i.subtype == ItemSubtype.HEALTH_POTION && i.amount > 0);
    if (potions.length === 0) {
      potions = items.filter((i) => i.subtype == ItemSubtype.HEALTH_ELIXIR && i.amount > 0);
    }
    if (potions.length > 0) {
      const potion = potions[0];
      return {
        heroId: actor.id,
        action: BattleStepActionType.USE_POTION,
        itemId: potion.id,
      };
    }
  }

  return null;
};

/** Check if health below 30% */
const lowHealth = (actor: Actor) => {
  return actor.health < actor.vitality! * HEALTH_PER_VITALITY * 0.3;
};

const removeEmptySteps = (steps: Map<number, BattleStep[]>) => {
  const result = new Map<number, BattleStep[]>();
  steps.forEach((v, k) => {
    if (v.length > 0) {
      result.set(k, v);
    }
  });
  return result;
};

const partyDefeated = (party: Actor[]) => {
  return !party.some((char) => char.health > 0);
};

export default getBattleSteps;
