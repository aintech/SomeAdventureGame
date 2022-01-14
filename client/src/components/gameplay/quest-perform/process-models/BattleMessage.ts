import CheckpointActor from './CheckpointActor';
import QuestHero from './QuestHero';

export type BattleMessage = {
  id: number;
  actorId: number;
  message: string;
};

export const dmgMessage = (actor: CheckpointActor | QuestHero, damage: number) => {
  return { id: Math.random(), actorId: actor.id, message: `-${damage}` };
};
