import query, { single } from "./Db";

export enum BuildingType {
  GUILD /** Send heroes to quest */,
  TAVERN /** Hiring heroes */,
  DWELLINGS /** Limit number of hired heroes */,
  STABLES /** Limit number of simultaneous embarked quests */,
  HEALER /** Healing heroes */,
  ELDER /**  Management town accounts */,
  TRAINING_GROUND /** Level up heroes */,
  ALCHEMIST /** Selling potions to heroes */,
  BLACKSMITH /** Upgrade heroes equipment to better tier*/,
  MARKET /** Heroes buy new equipment */,
  STORAGE /** Limit amount of dust */,
}

export type Building = {
  userId: number;
  type: BuildingType;
  level: number;
  upgrade?: {
    upgradeStarted?: number;
    cost: number;
    duration: number;
  };
};

export const initiateBuildings = async (userId: number) => {
  const buildingsCount = Object.keys(BuildingType).length;
  let values = "";
  for (let i = 0; i < buildingsCount; i++) {
    values += `(${userId}, ${i}, 1)${i < buildingsCount - 1 ? "," : ""}`;
  }
  return query<void>("initiateBuildings", `insert into public.building (user_id, type, level) values ${values};`);
};

export const getBuildings = (userId: number) => {
  return query<Building[]>(
    "getBuildings",
    `select build.*, upgrade.cost, upgrade.duration
     from public.building build
     left join public.building_upgrade upgrade on upgrade.type = build.type and upgrade.level = build.level + 1
     where user_id = $1`,
    [userId],
    mapBulding
  );
};

export const beginBuildingUpgrade = async (userId: number, type: number) => {
  return query<void>("beginBuildingUpgrade", "update public.building set upgrade_started = $3 where user_id = $1 and type = $2", [
    userId,
    type,
    new Date().getTime(),
  ]);
};

export const checkEnoughGoldForUpgrade = async (userId: number, type: number) => {
  return query<{ enough: boolean; cost: number }>(
    "checkEnoughGoldForUpgrade",
    `select st.gold >= build_up.cost as enough, build_up.cost as cost
     from public.stats st
     left join public.building build on build.user_id = st.user_id
     left join public.building_upgrade build_up on build_up.type = build.type and build_up.level = build.level + 1
     where st.user_id = $1 and build.type = $2`,
    [userId, type],
    (row: { enough: boolean; cost: number }) => {
      return {
        enough: row.enough,
        cost: +row.cost,
      };
    },
    single
  );
};

export const completeBuildingUpgrade = async (userId: number, type: number) => {
  return query<void>(
    "completeBuildingUpgrade",
    `update public.building set level = level + 1, upgrade_started = null where user_id = $1 and type = $2`,
    [userId, type]
  );
};

type BuildingRow = {
  user_id: string;
  type: string;
  level: string;
  cost: string;
  duration: string;
  upgrade_started: string;
};

const mapBulding = (row: BuildingRow): Building => {
  return {
    userId: +row.user_id,
    type: +row.type,
    level: +row.level,
    upgrade:
      row.cost || row.upgrade_started
        ? {
            upgradeStarted: row.upgrade_started ? +row.upgrade_started : undefined,
            cost: +row.cost,
            duration: +row.duration,
          }
        : undefined,
  };
};
