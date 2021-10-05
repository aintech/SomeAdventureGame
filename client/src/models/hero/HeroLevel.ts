import { HeroLevelResponse } from "../../services/HeroService";

export default class HeroLevel {
  constructor(
    public lvl: number,
    public definition: string,
    public experience: number,
    /** Relation of hero current experience to experience hero must acquire to reach next level */
    public progress: number,
    public levelUp: {
      cost: number;
      duration: number;
    }
  ) {}
}

export const convert = (response: HeroLevelResponse): HeroLevel => {
  return new HeroLevel(response.lvl, response.definition, response.experience, response.progress, response.levelUp);
};
