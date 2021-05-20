import usePool from "./use-pool.js";

const createStats = (userId) => {
  return new Promise((resolve, reject) => {
    usePool(
      "insert into public.stats (user_id, gold, fame) values ($1, $2, $3)",
      [userId, 1000, 0],
      (error, _) => {
        if (error) {
          return reject(new Error(`createStats ${error}`));
        }
        resolve({});
      }
    );
  });
};

const getStats = (userId) => {
  return new Promise((resolve, reject) => {
    usePool(
      "select * from public.stats where user_id = $1",
      [userId],
      (error, result) => {
        if (error) {
          return reject(new Error(`getStats ${error}`));
        }
        resolve(result.rows[0]);
      }
    );
  });
};

const addStats = (userId, gold, fame) => {
  return new Promise((resolve, reject) => {
    usePool(
      `update public.stats
       set gold = (gold + $2), fame = (fame + $3)
       where user_id = $1`,
      [userId, gold, fame],
      (error, _) => {
        if (error) {
          return reject(new Error(`addStats ${error}`));
        }
        resolve({});
      }
    );
  });
};

export { createStats, getStats, addStats };
