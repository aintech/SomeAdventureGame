import { HeroLevelResponse } from "../../services/HeroesService";

export default class HeroLevel {
  constructor(
    public lvl: number,
    /** Relation of hero current experience to experience hero must acquire to reach next level */
    public progress: number,
    public levelUp: boolean,
    cost: number
  ) {}
}

export const convert = (response: HeroLevelResponse): HeroLevel => {
  return new HeroLevel(response.lvl, response.progress, response.levelUp, response.cost);
};
