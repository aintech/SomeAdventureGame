import CheckpointActor from './CheckpointActor';
import QuestHero from './QuestHero';

export type BattleMessage = {
  id: number;
  actorId: number;
  message: string;
};

export const strMessage = (actor: CheckpointActor | QuestHero, message: string): BattleMessage => {
  return { id: Math.random(), actorId: actor.id, message };
};

export const dmgMessage = (actor: CheckpointActor | QuestHero, damage: number): BattleMessage => {
  return { id: Math.random(), actorId: actor.id, message: `-${damage}` };
};
