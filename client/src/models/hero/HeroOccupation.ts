import { HeroResponse } from "../../services/HeroesService";
import { HeroOccupationType, occupationFromString } from "./HeroOccupationType";

export default class HeroOccupation {
  constructor(
    public type: HeroOccupationType,
    public startedAt: Date,
    public duration: number | null,
    public occupationId: number | null
  ) {}
}

const convertOccupation = (response: HeroResponse): HeroOccupation | null => {
  if (!response.occupation_type) {
    return null;
  }
  return new HeroOccupation(
    occupationFromString(response.occupation_type),
    new Date(response.started_at),
    response.duration ? +response.duration : null,
    response.occupation_id ? +response.occupation_id : null
  );
};

export { convertOccupation };
