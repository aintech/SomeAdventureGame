import { anyOf, copy } from "../../../client/src/utils/arrays.js";
import { HEALTH_PER_VITALITY } from "../../../client/src/utils/variables.js";

const getBattleOutcome = (origMonsters, origHeroes) => {
  const monsters = copy(origMonsters);
  const heroes = copy(origHeroes);

  const battleSteps = new Map();
  for (let sec = 1; ; sec++) {
    battleSteps.set(sec, []);

    for (const hero of heroes) {
      checkAction(hero, null, null, monsters, sec, battleSteps);
      if (partyDefeated(monsters)) {
        return removeEmptySteps(battleSteps);
      }
    }

    for (const monster of monsters) {
      checkAction(null, monster, heroes, null, sec, battleSteps);
      if (partyDefeated(heroes)) {
        return removeEmptySteps(battleSteps);
      }
    }

    if (partyDefeated(monsters) || partyDefeated(heroes)) {
      return removeEmptySteps(battleSteps);
    }
  }
};

const checkAction = (hero, monster, heroes, monsters, sec, battleSteps) => {
  const actor = hero ?? monster;
  const opponents = heroes ?? monsters;

  if (sec % actor.initiative === 0) {
    let usePotion;

    if (lowHealth(actor)) {
      const action = potionAction(actor);
      if (action) {
        battleSteps.get(sec).push(action);
        actor.health = actor.vitality * HEALTH_PER_VITALITY;
        usePotion = true;
      }
    }

    if (!usePotion) {
      battleSteps.get(sec).push(attackAction(actor, opponents, hero, monster));
    }
  }
};

const attackAction = (actor, opponents, hero, monster) => {
  const aliveOpponents = opponents.filter((o) => +o.health > 0);
  const opponent = anyOf(aliveOpponents);
  const damage = Math.max(+actor.power - +opponent.defence, 0);
  opponent.health -= damage;

  const result = {
    heroId: hero ? hero.id : opponent.id,
    enemyId: hero ? opponent.actorId : monster.actorId,
    action: hero ? "hero_attack" : "enemy_attack",
    damage,
  };

  return result;
};

const potionAction = (actor) => {
  if (actor.items?.length > 0) {
    let potions = actor.items.filter(
      (i) => i.type == "health_potion" && i.amount > 0
    );
    if (potions.length === 0) {
      potions = actor.items.filter(
        (i) => i.type == "health_elixir" && i.amount > 0
      );
    }
    if (potions.length > 0) {
      const potion = potions[0];
      return {
        heroId: actor.hero_id,
        action: "use_potion",
        itemId: potion.id,
      };
    }
  }

  return null;
};

/** Check if health below 30% */
const lowHealth = (actor) => {
  if (!actor.hero_id) {
    return false;
  }
  return actor.health < actor.vitality * HEALTH_PER_VITALITY * 0.3;
};

const removeEmptySteps = (steps) => {
  return new Map([...steps].filter(([_, v]) => v.length > 0));
};

const partyDefeated = (party) => {
  return !party.some((char) => char.health > 0);
};

export default getBattleOutcome;
