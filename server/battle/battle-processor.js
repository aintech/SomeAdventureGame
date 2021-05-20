import { anyOf } from "../../client/src/utils/arrays.js";

const getBattleOutcome = (origMonsters, origHeroes) => {
  const monsters = origMonsters.map((m) => convertChar(m));
  const heroes = origHeroes.map((h) => convertChar(h));

  const battleSteps = new Map();
  for (let sec = 1; ; sec++) {
    battleSteps.set(sec, []);

    for (const hero of heroes) {
      if (sec % hero.initiative === 0) {
        const aliveMonsters = monsters.filter((m) => +m.health > 0);
        const opponent = anyOf(aliveMonsters);
        const hit = Math.max(+hero.power - +opponent.defence, 0);
        opponent.health -= hit;
        battleSteps.get(sec).push({
          heroId: hero.id,
          monsterId: opponent.id,
          action: "monster_hit",
          value: hit,
        });

        if (partyDefeated(monsters)) {
          return battleSteps;
        }
      }
    }

    for (const monster of monsters) {
      if (sec % monster.initiative === 0) {
        const aliveHeroes = heroes.filter((h) => +h.health > 0);
        const opponent = anyOf(aliveHeroes);
        const hit = Math.max(+monster.power - +opponent.defence, 0);
        opponent.health -= hit;

        battleSteps.get(sec).push({
          monsterId: monster.id,
          heroId: opponent.id,
          action: "hero_hit",
          value: hit,
        });

        if (partyDefeated(heroes)) {
          return battleSteps;
        }
      }
    }

    if (partyDefeated(monsters) || partyDefeated(heroes)) {
      return battleSteps;
    }
  }
};

const convertChar = (char) => {
  return {
    id: char.actorId ?? char.id,
    power: char.power,
    defence: char.defence,
    health: char.health,
    initiative: char.initiative,
  };
};

const partyDefeated = (party) => {
  return !party.some((char) => char.health > 0);
};

export default getBattleOutcome;
