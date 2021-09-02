import { getEquipmentStats } from "../../../../models/Equipment";
import Hero from "../../../../models/hero/Hero";
import { display } from "../../../../models/hero/HeroType";
import { CheckpointEnemy, EnemyDrop } from "../../../../models/QuestCheckpoint";
import { HEALTH_PER_VITALITY } from "../../../../utils/variables";

type CheckpointActor = {
  actorId: number;
  isHero: boolean;
  name: string;
  type: string;
  currentHealth: number;
  totalHealth: number;

  index: number;
  position: { x: number; y: number };
  drop: EnemyDrop[];
};

export const convertToActor = (actor: Hero | CheckpointEnemy, index: number, canvasH?: number): CheckpointActor => {
  return {
    isHero: actor.isHero,
    actorId: actor.isHero ? (actor as Hero).id : (actor as CheckpointEnemy).actorId,
    name: actor.name,
    type: actor.isHero ? display((actor as Hero).type) : actor.name,
    currentHealth: actor.health,
    totalHealth: actor.isHero
      ? ((actor as Hero).stats.vitality + getEquipmentStats((actor as Hero).equipment).vitality) * HEALTH_PER_VITALITY
      : actor.health,
    index,
    position: {
      x: (actor.isHero ? 30 : 600) + 50 * index * (actor.isHero ? 1 : -1),
      y: canvasH ?? 500 - (actor.isHero ? 135 : 120) - 15 * index,
    },
    drop: actor.isHero ? [] : (actor as CheckpointEnemy).drop,
  };
};

export default CheckpointActor;
