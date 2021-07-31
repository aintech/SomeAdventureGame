import { HeroResponse } from "../../services/HeroesService";
import { HeroActivityType } from "./HeroActivityType";

export default class HeroActivity {
  constructor(
    public type: HeroActivityType,
    public startedAt: Date,
    public duration?: number,
    public activityId?: number
  ) {}
}

export const convert = (response: HeroResponse): HeroActivity => {
  return new HeroActivity(response.activityType, new Date(response.startedAt), response.duration, response.activityId);
};
