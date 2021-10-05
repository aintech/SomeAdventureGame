import { HeroSkillResponse } from "../../services/HeroService";

export default class HeroSkill {
  constructor(public level: number, public name: string, public description: string) {}
}

export const convert = (response: HeroSkillResponse): HeroSkill => {
  return new HeroSkill(response.level, response.name, response.description);
};
