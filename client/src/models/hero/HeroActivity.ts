import { HeroResponse } from "../../services/HeroesService";
import { HeroActivityType, activityFromString } from "./HeroActivityType";

export default class HeroActivity {
  constructor(
    public type: HeroActivityType,
    public startedAt: Date,
    public duration: number | null,
    public activityId: number | null
  ) {}
}

const convertActivity = (response: HeroResponse): HeroActivity | null => {
  if (!response.activity_type) {
    return null;
  }

  return new HeroActivity(
    activityFromString(response.activity_type),
    new Date(response.started_at),
    response.duration ? +response.duration : null,
    response.activity_id ? +response.activity_id : null
  );
};

export { convertActivity };
