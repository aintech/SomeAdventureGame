import { HeroLevelResponse } from "../../services/HeroesService";

export default class HeroLevel {
  constructor(
    public lvl: number,
    public tier: string,
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
  return new HeroLevel(response.lvl, response.tier, response.experience, response.progress, response.levelUp);
};
