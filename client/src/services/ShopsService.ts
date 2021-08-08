import { AuthProps } from "../contexts/AuthContext";
import { EquipmentResponse, ItemResponse } from "./HeroesService";
import sendHttp from "./SendHttp";

const baseUrl = "/api/shops";

export const getMarketAssortment = async (auth: AuthProps) => {
  return await sendHttp<EquipmentResponse[]>(`${baseUrl}/market`, auth);
};

export const getAlchemistAssortment = async (auth: AuthProps) => {
  return await sendHttp<ItemResponse[]>(`${baseUrl}/alchemist`, auth);
};
