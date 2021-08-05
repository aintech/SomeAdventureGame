import { HeroActivityResponse } from "../../services/HeroesService";
import { HeroActivityType } from "./HeroActivityType";

export default class HeroActivity {
  constructor(
    public type: HeroActivityType,
    public startedAt: Date,
    public description: string,
    public duration?: number,
    public activityId?: number
  ) {}
}

export const convert = (response: HeroActivityResponse): HeroActivity => {
  return new HeroActivity(
    response.type,
    new Date(response.startedAt),
    response.description,
    response.duration,
    response.activityId
  );
};
