import usePool from "./use-pool.js";

const createStats = (userId) => {
  return new Promise((resolve, reject) => {
    usePool(
      "insert into public.stats (user_id, gold, fame) values ($1, $2, $3)",
      [userId, 1000, 0],
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result.rows[0]);
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
          reject(error);
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
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({});
      }
    );
  });
};

export { createStats, getStats, addStats };
