import query from '../Db';
import { HeroType, HeroWithPerks, HeroWithSkills } from './Hero';

enum SkillType {
  BIG_SWING,
  STUNNING_BLOW,
  ARMOR_CRASH,

  FIREBALL,
  FREEZE,
  TIME_FORWARD,

  BACKSTAB,
  POISON_HIT,
  DODGE,

  WORD_OF_HEALING,
  COMMON_GOOD,
  INSPIRATION,
}

export type Skill = {
  type: SkillType;
  mana: number;
  name: string;
  description: string;
  heroType?: HeroType;
};

const _s: Skill[] = [];
export const getSkills = async () => {
  if (_s.length === 0) {
    const dbSkills = await query<Skill[]>('getSkills', 'select * from public.skill', [], mapSkill);
    if (_s.length === 0) {
      _s.push(...dbSkills);
    }
  }
  return _s;
};

export const withSkills = async (heroes: HeroWithPerks[]) => {
  if (heroes.length === 0) {
    return [];
  }

  const skills = await getSkills();
  const heroWithSkills: HeroWithSkills[] = [];
  heroes.forEach((h) =>
    heroWithSkills.push({
      ...h,
      skills: skills
        .filter((s) => s.heroType === h.type)
        .map((s) => {
          return { type: s.type, name: s.name, description: s.description, mana: s.mana };
        }),
    })
  );

  return heroWithSkills;
};

type SkillRow = {
  id: string;
  name: string;
  description: string;
  type: string;
  hero_type: string;
  mana_cost: string;
};

const mapSkill = (row: SkillRow): Skill => {
  return {
    type: +row.type,
    name: row.name,
    description: row.description,
    heroType: +row.hero_type,
    mana: +row.mana_cost,
  };
};
