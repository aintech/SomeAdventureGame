import {
  CheckpointEnemyResponse,
  CheckpointResponse,
} from "../services/QuestsService";

export enum CheckpointType {
  TREASURE,
  BATTLE,
}

export enum CheckpointActionType {
  HERO_ATTACK,
  ENEMY_ATTACK,
}

export class CheckpointEnemy {
  constructor(
    public id: number,
    public actorId: number,
    public name: string,
    public health: number
  ) {}
}

export class CheckpointAction {
  constructor(
    public heroId: number,
    public enemyId: number,
    public action: CheckpointActionType,
    public damage: number
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
    public outcome: Map<number, CheckpointAction[]>,
    public enemies: CheckpointEnemy[],
    public tribute: number,
    public passed: boolean
  ) {}
}

const convertType = (type: string): CheckpointType => {
  switch (type) {
    case "treasure":
      return CheckpointType.TREASURE;
    case "battle":
      return CheckpointType.BATTLE;
    default:
      throw new Error(`Unknown checkpoint type ${type}`);
  }
};

const convertActionType = (action: string): CheckpointActionType => {
  switch (action) {
    case "hero_attack":
      return CheckpointActionType.HERO_ATTACK;
    case "enemy_attack":
      return CheckpointActionType.ENEMY_ATTACK;
    default:
      throw new Error(`Unknown action type in converter ${action}`);
  }
};

type CheckpointActionResponse = {
  heroId: number;
  enemyId: number;
  action: string;
  damage: number;
};

const convertOutcome = (
  type: CheckpointType,
  outcome: string
): Map<number, CheckpointAction[]> => {
  const result: Map<number, CheckpointAction[]> = new Map();
  const parsed: Map<number, CheckpointActionResponse[]> = new Map(
    JSON.parse(outcome)
  ) as Map<number, CheckpointActionResponse[]>;

  parsed.forEach((value, key) => {
    result.set(
      key,
      value.map(
        (v) =>
          new CheckpointAction(
            +v.heroId,
            +v.enemyId,
            convertActionType(v.action),
            v.damage
          )
      )
    );
  });

  return result;
};

const convertEnemies = (enemies: string): CheckpointEnemy[] => {
  const parsed = JSON.parse(enemies);
  if (parsed) {
    return (parsed as CheckpointEnemyResponse[]).map(
      (a) => new CheckpointEnemy(+a.id, +a.actorId, a.name, +a.health)
    );
  }
  return [];
};

const convert = (response: CheckpointResponse): QuestCheckpoint => {
  return new QuestCheckpoint(
    +response.id,
    +response.occured_at,
    convertType(response.type),
    +response.duration,
    convertOutcome(convertType(response.type), response.outcome),
    convertEnemies(response.enemies),
    +response.tribute,
    response.passed
  );
};

export { convert };
