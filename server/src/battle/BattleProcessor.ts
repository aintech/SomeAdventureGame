import { HeroWithItems } from "../repository/hero/Hero";
import { Item, ItemType } from "../repository/hero/Item";
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
  actorId: number | null /** actual for monster */;
  vitality: number | null /** actual for hero */;
  items: Item[] | null /** actual for hero */;
  type: ActorType;
};

export enum BattleStepActionType {
  HERO_ATTACK,
  ENEMY_ATTACK,
  USE_POTION,
}

export type BattleStep = {
  heroId: number;
  action: BattleStepActionType;
  enemyId: number | null;
  itemId: number | null;
  damage: number | null;
};

const map = (actor: HeroWithItems | Monster, type: ActorType): Actor => {
  return {
    ...actor,
    actorId: type === ActorType.MONSTER ? (actor as Monster).actorId : null,
    vitality: type === ActorType.HERO ? (actor as HeroWithItems).vitality : null,
    items: type === ActorType.HERO ? (actor as HeroWithItems).items : null,
    type,
  };
};

const getBattleSteps = (origMonsters: Monster[], origHeroes: HeroWithItems[]) => {
  const monsters = (copy(origMonsters) as Monster[]).map((a) => map(a, ActorType.MONSTER));
  const heroes = (copy(origHeroes) as HeroWithItems[]).map((a) => map(a, ActorType.HERO));

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

const attackStep = (actor: Actor, opponents: Actor[]): BattleStep => {
  const aliveOpponents = opponents.filter((o) => +o.health > 0);
  const opponent = anyOf(aliveOpponents);
  const damage = Math.max(+actor.power - +opponent.defence, 0);
  opponent.health -= damage;

  const result = {
    heroId: actor.type === ActorType.HERO ? actor.id : opponent.id,
    enemyId: actor.type === ActorType.MONSTER ? actor.actorId : opponent.actorId,
    action: actor.type === ActorType.HERO ? BattleStepActionType.HERO_ATTACK : BattleStepActionType.ENEMY_ATTACK,
    damage,
    itemId: null,
  };

  return result;
};

const potionStep = (actor: Actor): BattleStep | null => {
  const items = actor.items!;
  if (items.length > 0) {
    let potions = items.filter((i) => i.type == ItemType.HEALTH_POTION && i.amount > 0);
    if (potions.length === 0) {
      potions = items.filter((i) => i.type == ItemType.HEALTH_ELIXIR && i.amount > 0);
    }
    if (potions.length > 0) {
      const potion = potions[0];
      return {
        heroId: actor.id,
        action: BattleStepActionType.USE_POTION,
        itemId: potion.id,
        enemyId: null,
        damage: null,
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
