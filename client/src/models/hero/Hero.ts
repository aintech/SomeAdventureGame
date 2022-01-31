import { HeroResponse } from '../../services/HeroService';
import { HEALTH_PER_VITALITY, MANA_PER_VITALITY } from '../../utils/Variables';
import Equipment, { convert as convertEquipment, getEquipmentStats } from '../Equipment';
import { convertHeroItem, HeroItem } from '../Item';
import PersonageStats from '../PersonageStats';
import HeroActivity, { convert as convertActivity } from './HeroActivity';
import HeroLevel, { convert as convertLevel } from './HeroLevel';
import HeroPerk, { convert as convertPerk } from './HeroPerk';
import HeroSkill, { convert as convertSkill } from './HeroSkill';
import { HeroType } from './HeroType';

export default class Hero {
  constructor(
    public id: number,
    public name: string,
    public type: HeroType,
    public level: HeroLevel,
    public stats: PersonageStats,
    public equipStats: PersonageStats, // aggregation of equipment stats surpluses
    public health: number,
    public mana: number,
    public gold: number,
    public equipment: Equipment[],
    public items: HeroItem[],
    public perks: HeroPerk[],
    public skills: HeroSkill[],
    public activity?: HeroActivity,
    public isHero?: boolean
  ) {}
}

export const isAlive = (hero: Hero) => {
  return hero.health > 0;
};

export const calcHealthFraction = (hero: Hero): number => {
  if (hero.health <= 0) {
    return 0;
  }
  return hero.health / maxHealth(hero);
};

export const calcManaFraction = (hero: Hero): number => {
  if (hero.mana <= 0) {
    return 0;
  }
  return hero.mana / maxMana(hero);
};

export const maxHealth = (hero: Hero): number => {
  return (hero.stats.vitality + hero.equipStats.vitality) * HEALTH_PER_VITALITY;
};

export const maxMana = (hero: Hero): number => {
  return (hero.stats.wizdom + hero.equipStats.wizdom) * MANA_PER_VITALITY;
};

export const convert = (response: HeroResponse): Hero => {
  const equipment = response.equipment.map((e) => convertEquipment(e));
  const equipStats = getEquipmentStats(equipment);
  return new Hero(
    response.id,
    response.name,
    response.type,
    convertLevel(response.level),
    new PersonageStats(response.power, response.defence, response.vitality, response.wizdom, response.initiative),
    equipStats,
    response.health,
    response.mana,
    response.gold,
    equipment,
    response.items.map((i) => convertHeroItem(i)),
    response.perks.map((p) => convertPerk(p)),
    response.skills.map((s) => convertSkill(s)),
    response.activity ? convertActivity(response.activity) : undefined,
    true
  );
};
