import usePool from "./use-pool.js";

let _monsters = [];
const _fetchMonsters = () => {
  return new Promise((resolve, reject) => {
    usePool("select * from public.monster", [], (error, result) => {
      if (error) {
        return reject(new Error(`fetchMonster ${error}`));
      }
      resolve(result.rows);
    });
  });
};

const getMonsterParty = async (level) => {
  if (_monsters.length === 0) {
    _monsters = await _fetchMonsters();
  }

  const partyCount = Math.random() > 0.5 ? 2 : 3; // Math.floor(Math.random() * 3) + 1;
  const monstersByLevel = _monsters.filter((m) => m.level === level);
  const monsters = [];
  for (let i = 0; i < partyCount; i++) {
    const monster =
      monstersByLevel[Math.floor(Math.random() * monstersByLevel.length)];
    monster.actorId = i;
    monsters.push(monster);
  }

  return monsters;
};

export { getMonsterParty };
