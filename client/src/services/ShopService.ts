import { AuthProps } from "../contexts/AuthContext";
import { EquipmentResponse, ItemResponse } from "./HeroService";
import sendHttp from "./SendHttp";

const baseUrl = "/api/shop";

export const getMarketAssortment = async (auth: AuthProps) => {
  return await sendHttp<EquipmentResponse[]>(`${baseUrl}/market`, auth);
};

export const getAlchemistAssortment = async (auth: AuthProps) => {
  return await sendHttp<ItemResponse[]>(`${baseUrl}/alchemist`, auth);
};
