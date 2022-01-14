import PersonageStats from '../../../../models/PersonageStats';
import { CheckpointEnemy } from '../../../../models/QuestCheckpoint';
import { StatusEffect } from './StatusEffect';

export type CheckpointActor = {
  id: number;
  name: string;
  type: string;
  health: number;
  totalHealth: number;
  stats: PersonageStats;
  statusEffects: StatusEffect[];

  isHero?: boolean;
  hitted?: boolean;
};

export const convertToActor = (actor: CheckpointEnemy): CheckpointActor => {
  return {
    // Превращаем actorId в id чтобы и у актера и QuestHero было поле id,
    // изначальный id из CheckpointEnemy не использум, т.к. он одинаков для одного типа противников
    // минусы чтобы айдишники отличались от геройских
    id: -actor.actorId - 1,
    name: actor.name,
    type: actor.name,
    health: actor.health,
    totalHealth: actor.health,
    stats: actor.stats,
    statusEffects: [],
  };
};

export default CheckpointActor;
