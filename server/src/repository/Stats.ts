import query, { single } from "./Db";

type Stats = {
  user_id: number;
  gold: number;
  fame: number;
};

const createStats = (userId: number) => {
  return query<void>(
    "createStats",
    "insert into public.stats (user_id, gold, fame) values ($1, $2, $3)",
    [userId, 1000, 0]
  );
};

const getStats = (userId: number) => {
  return query<Stats>(
    "getStats",
    "select * from public.stats where user_id = $1",
    [userId],
    single
  );
};

const addStats = (userId: number, gold: number, fame: number = 0) => {
  return query<void>(
    "addStats",
    `update public.stats
     set gold = (gold + $2), fame = (fame + $3)
     where user_id = $1`,
    [userId, gold, fame]
  );
};

export { createStats, getStats, addStats };
