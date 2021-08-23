import { getEquipmentStats } from "../../../../../models/Equipment";
import Hero from "../../../../../models/hero/Hero";
import { display } from "../../../../../models/hero/HeroType";
import { CheckpointEnemy } from "../../../../../models/QuestCheckpoint";
import { HEALTH_PER_VITALITY } from "../../../../../utils/variables";

type CheckpointActor = {
  actorId: number;
  isHero: boolean;
  name: string;
  type: string;
  currentHealth: number;
  totalHealth: number;

  index: number;
  position: { x: number; y: number };
};

// type CheckpointActorProps = {
//   actor: CheckpointActorItem;
// };

// const CheckpointActor = ({ actor }: CheckpointActorProps) => {
//   const healthRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
//   const canvasW = 28;
//   const canvasH = 8;

//   useEffect(() => {
//     const healthCtx = healthRef.current.getContext("2d")!;
//     healthCtx.clearRect(0, 0, canvasW, canvasH);
//     healthCtx.fillStyle = "lightgray";
//     healthCtx.fillRect(0, 0, canvasW, canvasH);
//     healthCtx.fillStyle = "red";
//     healthCtx.fillRect(0, 0, canvasW * (actor.currentHealth / actor.totalHealth), canvasH);
//   }, [actor.currentHealth, actor.totalHealth]);

//   const portrait = (isHero: boolean, type: string) => {
//     if (isHero) {
//       return HeroType[fromDisplay(type)].toLowerCase();
//     }
//     return "skeleton";
//   };

//   return (
//     <div className={`actor-item${actor.currentHealth < 0 ? " actor-item--defeated" : ""}`}>
//       <div className={`actor-item__portrait--${portrait(actor.isHero, actor.type)}`}></div>
//       <div className="actor-item__name">{actor.name.substring(0, 6)}</div>
//       <div className="actor-item__health">
//         <canvas ref={healthRef} width={canvasW} height={canvasH}></canvas>
//       </div>
//     </div>
//   );
// };

export const convertToActor = (actor: Hero | CheckpointEnemy, index: number, canvasH: number): CheckpointActor => {
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
      y: canvasH - (actor.isHero ? 135 : 120) - 15 * index,
    },
  };

  // if (actor.isHero) {
  //   const hero = actor as Hero;
  //   return {
  //     actorId: hero.id,
  //     isHero: true,
  //     name: hero.name,
  //     type: display(hero.type),
  //     currentHealth: hero.health,
  //     totalHealth: (hero.stats.vitality + getEquipmentStats(hero.equipment).vitality) * HEALTH_PER_VITALITY,
  //     index,
  //   };
  // } else {
  //   const enemy = actor as CheckpointEnemy;
  //   return {
  //     actorId: enemy.actorId,
  //     isHero: false,
  //     name: enemy.name,
  //     type: enemy.name,
  //     currentHealth: enemy.health,
  //     totalHealth: enemy.health,
  //     index,
  //   };
  // }
};

export default CheckpointActor;
