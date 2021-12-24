import PersonageStats from '../../../../../models/PersonageStats';
import { CheckpointEnemy } from '../../../../../models/QuestCheckpoint';

type CheckpointActor = {
  id: number;
  name: string;
  type: string;
  health: number;
  totalHealth: number;
  stats: PersonageStats;

  isHero?: boolean;
  hitted?: boolean;
};

export const convertToActor = (actor: CheckpointEnemy): CheckpointActor => {
  return {
    // Превращаем actorId в id чтобы не заморачиваться с разницей с QuestHero,
    // изначальный id из CheckpointEnemy не использум, т.к. он одинаков для одниого типа противников
    // минусы чтобы айдишники отличались от геройских
    id: -actor.actorId - 1,
    name: actor.name,
    type: actor.name,
    health: actor.health,
    totalHealth: actor.health,
    stats: actor.stats,
  };
};

export default CheckpointActor;
