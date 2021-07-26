import { AuthProps } from "../contexts/AuthContext";
import { EquipmentType } from "../models/Equipment";
import GameStats from "../models/GameStats";
import Hero from "../models/hero/Hero";
import { HeroActivityType } from "../models/hero/HeroActivityType";
import { HeroItemType } from "../models/hero/HeroItem";
import { HeroType } from "../models/hero/HeroType";
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
  type: EquipmentType;
  level: number;
  mage: boolean;
  warrior: boolean;
  price: number;
  avatar: string;
}

export interface HeroResponse extends StatsHolder {
  id: number;
  name: string;
  type: HeroType;
  level: number;
  health: number;
  experience: number;
  progress: number;
  gold: number;
  equipment: EquipmentResponse[];
  items: HeroItemResponse[];
  perks: HeroPerkResponse[];
  skills: HeroSkillResponse[];
  activityId: number;
  activityType: HeroActivityType;
  startedAt: string;
  duration: number | null;
}

export interface HeroItemResponse {
  id: number;
  type: HeroItemType;
  amount: number;
}

export interface HireHeroResponse {
  stats: GameStats;
  hired: HeroResponse;
}

export interface HeroPerkResponse {
  id: number;
  heroId: number;
  name: string;
  description: string;
}

export interface HeroSkillResponse {
  level: number;
  name: string;
  description: string;
}

export const getHeroes = async (auth: AuthProps) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}`, auth);
};

export const getTavernPatrons = async (auth: AuthProps) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}/tavern`, auth);
};

export const hireHero = async (auth: AuthProps, hero: Hero) => {
  return await sendHttp<HireHeroResponse>(`${baseUrl}/hire`, auth, [`hero_id=${hero.id}`], "PUT");
};

export const dismissHero = async (auth: AuthProps, hero: Hero) => {
  return await sendHttp<{ heroId: number }>(`${baseUrl}/dismiss`, auth, [`hero_id=${hero.id}`], "PUT");
};

export const updateHeroActivities = async (
  auth: AuthProps,
  activities: { heroId: number; type: HeroActivityType }[]
) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}/activity`, auth, [], "PUT", activities);
};
