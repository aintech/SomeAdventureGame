import PersonageStats from '../../../../../models/PersonageStats';
import { CheckpointEnemy, EnemyDrop } from '../../../../../models/QuestCheckpoint';

type CheckpointActor = {
  actorId: number;
  name: string;
  type: string;
  currentHealth: number;
  totalHealth: number;
  stats: PersonageStats;
  drop: EnemyDrop[];

  hitTime: number;
  xOffset: number;

  isHero: boolean;
};

export const convertToActor = (actor: CheckpointEnemy): CheckpointActor => {
  return {
    actorId: actor.actorId,
    name: actor.name,
    type: actor.name,
    currentHealth: actor.health,
    totalHealth: actor.health,
    stats: actor.stats,
    drop: actor.drop,
    hitTime: 0,
    xOffset: 0,
    isHero: false,
  };
};

export default CheckpointActor;
