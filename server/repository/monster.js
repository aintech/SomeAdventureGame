import { anyOf } from "../../shared/utils/arrays.js";
import query from "./db.js";

let _monsters = [];
const _fetchMonsters = () => {
  return query("fetchMonsters", "select * from public.monster");
};

const getMonsterParty = async (level) => {
  if (_monsters.length === 0) {
    _monsters = await _fetchMonsters();
  }

  const partyCount = Math.random() > 0.5 ? 2 : 3; // Math.floor(Math.random() * 3) + 1;
  //Пока в базе есть только монстры 1 уровня
  const monstersByLevel = [..._monsters]; //_monsters.filter((m) => m.level === level);
  const monsters = [];
  for (let i = 0; i < partyCount; i++) {
    const monster = JSON.parse(JSON.stringify(anyOf(monstersByLevel)));
    monster.actorId = i;
    monsters.push(monster);
  }

  return monsters;
};

export { getMonsterParty };
