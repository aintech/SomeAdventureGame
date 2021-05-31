import { AuthProps } from "../contexts/AuthContext";
import GameStats from "../models/GameStats";
import Hero from "../models/Hero";
import sendHttp from "./SendHttp";

const baseUrl = "/api/heroes";

export interface StatsHolder {
  power: number;
  defence: number;
  vitality: number;
  initiative: number;
}

export interface EquipmentResponse extends StatsHolder {
  id: number;
  name: string;
  description: string;
  type: string;
  level: number;
  mage: boolean;
  warrior: boolean;
  price: number;
  avatar: string;
}

export interface HeroResponse extends StatsHolder {
  id: number;
  name: string;
  type: string;
  level: number;
  health: number;
  experience: number;
  progress: number;
  gold: number;
  embarked_quest: number | null;
  equipment: EquipmentResponse[];
}

const getHeroes = async (auth: AuthProps) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}`, auth);
};

const getTavernPatrons = async (auth: AuthProps) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}/tavern`, auth);
};

export interface HireHeroResponse {
  stats: GameStats;
  hired: HeroResponse;
}

const hireHero = async (auth: AuthProps, hero: Hero) => {
  return await sendHttp<HireHeroResponse>(
    `${baseUrl}/hire`,
    auth,
    [`hero_id=${hero.id}`],
    "PUT"
  );
};

export { getHeroes, getTavernPatrons, hireHero };
