import query from './Db';

export type Loot = {
  gold: number;
};

export type Monster = {
  id: number;
  actorId: number;
  level: number;
  name: string;
  power: number;
  health: number;
  initiative: number;
  defence: number;
  experience: number;
  loot: Loot;
};

let monsters: Monster[] = [];
export const prepareMonsters = async () => {
  if (monsters.length === 0) {
    monsters = await query<Monster[]>('fetchMonsters', 'select * from public.monster', [], mapMonster);
  }
};

export const getAllMonsters = () => {
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
  experience: string;
  loot: string;
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
    experience: +row.experience,
    loot: JSON.parse(row.loot),
  };
};
