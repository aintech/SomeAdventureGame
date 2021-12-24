import { CheckpointEnemyResponse, CheckpointResponse } from '../services/QuestService';
import PersonageStats from './PersonageStats';

export enum CheckpointType {
  BATTLE,
  TREASURE,
}

export enum BattleActionType {
  USE_POTION,
}

export class CheckpointEnemy {
  constructor(public id: number, public actorId: number, public name: string, public health: number, public stats: PersonageStats) {}
}

export class BattleRound {
  constructor(public heroId: number, public action: BattleActionType, public itemId?: number, public hpAdjust?: number) {}
}

export default class QuestCheckpoint {
  constructor(
    public id: number,
    public occuredTime: number,
    public type: CheckpointType,
    public passed: boolean,
    public enemies?: CheckpointEnemy[]
  ) {}
}

export const convert = (response: CheckpointResponse): QuestCheckpoint => {
  return new QuestCheckpoint(
    response.id,
    response.occuredAt,
    response.type,
    response.passed,
    response.enemies ? response.enemies.map((e) => convertEnemy(e)) : undefined
  );
};

const convertEnemy = (res: CheckpointEnemyResponse): CheckpointEnemy => {
  return new CheckpointEnemy(res.id, res.actorId, res.name, res.health, {
    power: res.power,
    defence: res.defence,
    initiative: res.initiative,
    wizdom: 0,
    vitality: 0,
  });
};
