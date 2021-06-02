import query, { single } from "./db.js";

const createStats = (userId) => {
  return query(
    "createStats",
    "insert into public.stats (user_id, gold, fame) values ($1, $2, $3)",
    [userId, 1000, 0]
  );
};

const getStats = (userId) => {
  return query(
    "getStats",
    "select * from public.stats where user_id = $1",
    [userId],
    single
  );
};

const addStats = (userId, gold, fame) => {
  return query(
    "addStats",
    `update public.stats
     set gold = (gold + $2), fame = (fame + $3)
     where user_id = $1`,
    [userId, gold, fame]
  );
};

export { createStats, getStats, addStats };
