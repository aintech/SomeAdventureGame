import { CheckpointResponse } from "../services/QuestsService";

export enum CheckpointType {
  TREASURE,
  BATTLE,
}

export enum BattleStepActionType {
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
    public isHero: boolean = false
  ) {}
}

export class BattleStep {
  constructor(
    public heroId: number,
    public action: BattleStepActionType,
    public enemyId: number | null,
    public itemId: number | null,
    public damage: number | null
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
    /** key of this Map is second on which action occures */
    public steps: Map<number, BattleStep[]> | null,
    public enemies: CheckpointEnemy[] | null,
    public tribute: number,
    public passed: boolean
  ) {}
}

export const convert = (response: CheckpointResponse): QuestCheckpoint => {
  return new QuestCheckpoint(
    response.id,
    response.occuredAt,
    response.type,
    response.duration,
    response.stringifiedSteps ? mapSteps(response.stringifiedSteps) : null,
    response.enemies,
    response.tribute,
    response.passed
  );
};

/** duplicate code in server */
const mapSteps = (steps: string | null) => {
  if (!steps) {
    return null;
  }
  const result: Map<number, BattleStep[]> = new Map();
  steps.split(",\n").forEach((s) => {
    const secStep = s.split("::");
    result.set(+secStep[0], JSON.parse(secStep[1]));
  });

  return result;
};
