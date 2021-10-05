import { HeroPerkResponse } from "../../services/HeroService";

export default class HeroPerk {
  constructor(public id: number, public name: string, public description: string) {}
}

export const convert = (response: HeroPerkResponse): HeroPerk => {
  return new HeroPerk(response.id, response.name, response.description);
};
