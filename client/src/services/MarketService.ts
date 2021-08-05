import { AuthProps } from "../contexts/AuthContext";
import { EquipmentResponse } from "./HeroesService";
import sendHttp from "./SendHttp";

const baseUrl = "/api/market";

export const getAssortment = async (auth: AuthProps) => {
  return await sendHttp<EquipmentResponse[]>(`${baseUrl}`, auth);
};
