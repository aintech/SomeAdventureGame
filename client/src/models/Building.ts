export enum BuildingType {
  GUILD,
  TAVERN,
}

export default class Building {
  constructor(public id: number, public type: BuildingType) {}
}
