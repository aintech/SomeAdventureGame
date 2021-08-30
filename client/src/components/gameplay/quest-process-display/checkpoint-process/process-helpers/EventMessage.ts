import Color from "./Color";

export enum Direction {
  LEFT,
  RIGHT,
  CENTER,
}

export enum Effect {
  FADE_IN,
  FADE_OUT,
  FADE_IN_OUT,
  FLY_AWAY,
}

export class EventMessage {
  private _id: number;
  private _fireTime: Date;

  constructor(
    public lifetime: number, // in seconds
    public position: { x: number; y: number },
    public fontSize: number,
    public message: string,
    public color: Color,
    public direction: Direction,
    public effect: Effect
  ) {
    this._id = new Date().getTime() * Math.random();
    this._fireTime = new Date();
  }

  public id() {
    return this._id;
  }

  public fireTime() {
    return this._fireTime;
  }
}
