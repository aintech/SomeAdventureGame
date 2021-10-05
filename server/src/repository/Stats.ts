import query, { single } from "./Db";

type Stats = {
  userId: number;
  gold: number;
  fame: number;
};

export const initiateStats = (userId: number) => {
  return query<void>("createStats", "insert into public.stats (user_id, gold, fame) values ($1, $2, $3)", [
    userId,
    1000,
    0,
  ]);
};

export const getStats = (userId: number) => {
  return query<Stats>("getStats", "select * from public.stats where user_id = $1", [userId], mapStats, single);
};

export const addStats = (userId: number, gold: number, fame: number = 0) => {
  return query<void>(
    "addStats",
    `update public.stats
     set gold = (gold + $2), fame = (fame + $3)
     where user_id = $1`,
    [userId, gold, fame]
  );
};

type StatsRow = {
  user_id: string;
  gold: string;
  fame: string;
};

const mapStats = (row: StatsRow): Stats => {
  return {
    userId: +row.user_id,
    gold: +row.gold,
    fame: +row.fame,
  };
};
