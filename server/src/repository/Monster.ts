import { anyOf } from "../utils/Arrays";
import query from "./Db";

export type Monster = {
  id: number;
  actorId: number;
  level: number;
  name: string;
  power: number;
  health: number;
  initiative: number;
  defence: number;
};

let monsters: Monster[] = [];
const fetchMonsters = () => {
  return query<Monster[]>("fetchMonsters", "select * from public.monster", [], mapMonster);
};

export const getMonsterParty = async (level: number) => {
  if (monsters.length === 0) {
    monsters = await fetchMonsters();
  }

  const partyCount = Math.random() > 0.5 ? 2 : 3; // Math.floor(Math.random() * 3) + 1;
  //Пока в базе есть только монстры 1 уровня
  const monstersByLevel = [...monsters]; //_monsters.filter((m) => m.level === level);
  const suitable: Monster[] = [];
  for (let i = 0; i < partyCount; i++) {
    const monster: Monster = JSON.parse(JSON.stringify(anyOf(monstersByLevel)));
    monster.actorId = i;
    suitable.push(monster);
  }

  return suitable;
};

type MonsterRow = {
  id: string;
  level: string;
  name: string;
  power: string;
  health: string;
  initiative: string;
  defence: string;
};

const mapMonster = (row: MonsterRow) => {
  return {
    id: +row.id,
    level: +row.level,
    name: row.name,
    power: +row.power,
    health: +row.health,
    initiative: +row.initiative,
    defence: +row.defence,
  };
};
