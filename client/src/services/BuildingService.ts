import { AuthProps } from "../contexts/AuthContext";
import Building from "../models/Building";
import sendHttp from "./SendHttp";

const baseUrl = "/api/building";

export const getBuildings = async (auth: AuthProps) => {
  return await sendHttp<Building[]>(`${baseUrl}`, auth);
};
