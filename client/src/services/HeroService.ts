import { AuthProps } from '../contexts/AuthContext';
import { EquipmentType } from '../models/Equipment';
import GameStats from '../models/GameStats';
import Hero from '../models/hero/Hero';
import { HeroActivityType } from '../models/hero/HeroActivity';
import { HeroType } from '../models/hero/HeroType';
import { ItemSubtype, ItemType } from '../models/Item';
import sendHttp from './SendHttp';

const baseUrl = '/api/hero';

export interface StatsHolderResponse {
  power: number;
  defence: number;
  vitality: number;
  wizdom: number;
  initiative: number;
}

export interface EquipmentResponse extends StatsHolderResponse {
  id: number;
  name: string;
  description: string;
  type: EquipmentType;
  level: number;
  warrior: boolean;
  thief: boolean;
  mage: boolean;
  healer: boolean;
  price: number;
  tier?: number;
}

export interface HeroResponse extends StatsHolderResponse {
  id: number;
  name: string;
  type: HeroType;
  level: HeroLevelResponse;
  health: number;
  mana: number;
  gold: number;
  equipment: EquipmentResponse[];
  items: HeroItemResponse[];
  perks: HeroPerkResponse[];
  skills: HeroSkillResponse[];
  activity?: HeroActivityResponse;
}

export interface HeroActivityResponse {
  type: HeroActivityType;
  startedAt: string;
  description: string;
  activityId?: number;
  duration?: number;
}

export interface ItemResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  type: ItemType;
  subtype: ItemSubtype;
  buyingTime: number;
}

export interface HeroItemResponse extends ItemResponse {
  amount: number;
}

export interface HireHeroResponse {
  stats: GameStats;
  hired: HeroResponse;
}

export interface HeroLevelResponse {
  lvl: number;
  definition: string;
  experience: number;
  progress: number;
  levelUp: {
    cost: number;
    duration: number;
  };
}

export interface HeroPerkResponse {
  id: number;
  heroId: number;
  name: string;
  description: string;
}

export interface HeroSkillResponse {
  type: number;
  name: string;
  description: string;
  mana: number;
}

export const getHeroes = async (auth: AuthProps) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}`, auth);
};

export const getTavernPatrons = async (auth: AuthProps) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}/tavern`, auth);
};

export const hireHero = async (auth: AuthProps, hero: Hero) => {
  return await sendHttp<HireHeroResponse>(`${baseUrl}/hire`, auth, [`hero_id=${hero.id}`], 'PUT');
};

export const dismissHero = async (auth: AuthProps, hero: Hero) => {
  return await sendHttp<{ heroId: number }>(`${baseUrl}/dismiss`, auth, [`hero_id=${hero.id}`], 'PUT');
};

export const updateHeroActivities = async (auth: AuthProps, activities: { heroId: number; type: HeroActivityType }[]) => {
  return await sendHttp<HeroResponse[]>(`${baseUrl}/activity`, auth, [], 'PUT', activities);
};
