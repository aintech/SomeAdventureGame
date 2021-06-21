export enum BuildingType {
  GUILD,
  TAVERN,
  HEALER,
}

export default class Building {
  constructor(public id: number, public type: BuildingType) {}
}
