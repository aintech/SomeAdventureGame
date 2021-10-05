import query from "./Db";

export enum BuildingType {
  GUILD /** Send heroes to quest, Limit number of hired heroes */,
  TAVERN /** Hiring heroes */,
  STABLES /** Limit number of simultaneous embarked quests */,
  HEALER /** Healing heroes */,
  TREASURY /** Management village accounts */,
  TRAINING_GROUND /** Level up heroes */,
  ALCHEMIST /** Selling potions to heroes */,
  TEMPLE /** Buff heroes */,
  BLACKSMITH /** Upgrade heroes equipment to better tier*/,
  STORAGE /** Limit amount of items user can store */,
  MARKET /** Heroes buy new equipment */,
}

export type Building = {
  userId: number;
  type: BuildingType;
  level: number;
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
    "select * from public.building where user_id = $1",
    [userId],
    (row: { user_id: string; type: string; level: string }) => {
      return {
        userId: +row.user_id,
        type: +row.type,
        level: +row.level,
      };
    }
  );
};
