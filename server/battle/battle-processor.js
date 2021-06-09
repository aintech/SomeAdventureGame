import { anyOf, copy } from "../../client/src/utils/arrays.js";

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
    const aliveOpponents = opponents.filter((o) => +o.health > 0);
    const opponent = anyOf(aliveOpponents);
    const damage = Math.max(+actor.power - +opponent.defence, 0);
    opponent.health -= damage;

    battleSteps.get(sec).push({
      heroId: hero ? hero.id : opponent.id,
      enemyId: hero ? opponent.actorId : monster.actorId,
      action: hero ? "hero_attack" : "enemy_attack",
      damage,
    });
  }
};

const removeEmptySteps = (steps) => {
  return new Map([...steps].filter(([_, v]) => v.length > 0));
};

const partyDefeated = (party) => {
  return !party.some((char) => char.health > 0);
};

export default getBattleOutcome;
