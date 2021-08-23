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
export const getAllMonsters = async () => {
  if (monsters.length === 0) {
    monsters = await query<Monster[]>("fetchMonsters", "select * from public.monster", [], mapMonster);
  }
  return monsters;
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
