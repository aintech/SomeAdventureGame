import { AuthProps } from "../contexts/AuthContext";
import Building from "../models/Building";
import GameStats from "../models/GameStats";
import sendHttp from "./SendHttp";

const baseUrl = "/api/building";

export const getBuildings = async (auth: AuthProps) => {
  return await sendHttp<Building[]>(`${baseUrl}`, auth);
};

export const startBuildingUpgrade = async (auth: AuthProps, type: number) => {
  return await sendHttp<{ stats: GameStats; buildings: Building[] }>(`${baseUrl}/upgrade`, auth, [`type=${type}`]);
};
