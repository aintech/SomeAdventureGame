import { CheckpointEnemyResponse, CheckpointResponse } from '../services/QuestService';
import PersonageStats from './PersonageStats';

export enum CheckpointType {
  START,
  BOSS,
  BATTLE,
  TREASURE,
  CAMP,
}

export enum CheckpointStatus {
  AVAILABLE,
  CHOOSEABLE,
  DISABLED,
  COMPLETED,
}

export class CheckpointEnemy {
  constructor(public id: number, public actorId: number, public name: string, public health: number, public stats: PersonageStats) {}
}

// В будущем ещё можно добавить items, которые уходят игроку.
export type CheckpointReward = {
  checkpointId: number;
  rewards: { heroId: number; gold: number; experience: number }[];
};

export default class QuestCheckpoint {
  constructor(
    public id: number,
    public stage: number,
    public type: CheckpointType,
    public status: CheckpointStatus,
    public enemies?: CheckpointEnemy[],
    public linked?: number[]
  ) {}
}

export const convert = (response: CheckpointResponse): QuestCheckpoint => {
  return new QuestCheckpoint(
    response.id,
    response.stage,
    response.type,
    response.status,
    response.enemies ? response.enemies.map((e) => convertEnemy(e)) : undefined,
    response.linked
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
