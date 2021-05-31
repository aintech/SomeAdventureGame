import { AuthProps } from "../contexts/AuthContext";
import GameStats from "../models/GameStats";
import sendHttp from "./SendHttp";

const baseUrl = "/api/stats";

const getStats = async (auth: AuthProps) => {
  return await sendHttp<GameStats>(`${baseUrl}`, auth);
};

export { getStats };
