import query from "../Db";
import { HeroType, HeroWithPerks, HeroWithSkills } from "./Hero";

export type Skill = {
  id: number;
  name: string;
  description: string;
  heroType: string;
  level: number;
};

const _s: Skill[] = [];
export const getSkills = async () => {
  if (_s.length === 0) {
    const dbSkills = await query<Skill[]>("getSkills", "select * from public.skill", [], mapSkill);
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
    heroWithSkills.push({ ...h, skills: skills.filter((s) => s.heroType === HeroType[h.type].toLowerCase()) })
  );

  return heroWithSkills;
};

type SkillRow = {
  id: string;
  name: string;
  description: string;
  hero_type: string;
  level: string;
};

const mapSkill = (row: SkillRow): Skill => {
  return {
    id: +row.id,
    name: row.name,
    description: row.description,
    heroType: row.hero_type,
    level: +row.level,
  };
};
