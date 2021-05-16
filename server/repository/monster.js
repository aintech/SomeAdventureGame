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

/**
 * TODO: Возвращать монстров в зависимости от уровня
 */
const getMonsters = async (level) => {
  if (_monsters.length === 0) {
    _monsters = await _fetchMonsters();
  }

  return Promise.resolve(_monsters.slice());
};

export { getMonsters };
