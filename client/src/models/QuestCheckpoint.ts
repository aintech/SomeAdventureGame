import { CheckpointResponse } from "../services/QuestsService";

export enum CheckpointType {
  TREASURE,
  BATTLE,
}

export enum BattleActionType {
  HERO_ATTACK,
  ENEMY_ATTACK,
  USE_POTION,
}

export class CheckpointEnemy {
  constructor(
    public id: number,
    public actorId: number,
    public name: string,
    public health: number,
    public experience: number,
    public isHero: boolean = false
  ) {}
}

export class BattleRound {
  constructor(
    public heroId: number,
    public action: BattleActionType,
    public enemyId?: number,
    public itemId?: number,
    public hpAdjust?: number
  ) {}
}

export default class QuestCheckpoint {
  constructor(
    public id: number,
    /** moment (second) on which checkpoint occures from quest start */
    public occuredTime: number,
    public type: CheckpointType,
    /** duration of checkpoint in seconds */
    public duration: number,
    public tribute: number,
    public passed: boolean,
    /** key of this Map is second on which action occures */
    public rounds?: Map<number, BattleRound[]>,
    public enemies?: CheckpointEnemy[]
  ) {}
}

export const convert = (response: CheckpointResponse): QuestCheckpoint => {
  return new QuestCheckpoint(
    response.id,
    response.occuredAt,
    response.type,
    response.duration,
    response.tribute,
    response.passed,
    mapRounds(response.stringifiedRounds),
    response.enemies
  );
};

/** duplicate code in server */
const mapRounds = (rounds?: string) => {
  if (!rounds) {
    return undefined;
  }
  const result: Map<number, BattleRound[]> = new Map();
  rounds.split(",\n").forEach((s) => {
    const roundToTime = s.split("::");
    result.set(+roundToTime[0], JSON.parse(roundToTime[1]));
  });

  return result;
};
