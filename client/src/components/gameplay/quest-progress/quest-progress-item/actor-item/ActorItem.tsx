import { useEffect, useRef } from "react";
import Hero from "../../../../../models/hero/Hero";
import {
  display,
  fromDisplay,
  HeroType,
} from "../../../../../models/hero/HeroType";
import { CheckpointEnemy } from "../../../../../models/QuestCheckpoint";
import { HEALTH_PER_VITALITY } from "../../../../../utils/variables";
import "./actor-item.scss";

export type ActorItemType = {
  actorId: number;
  isHero: boolean;
  name: string;
  type: string;
  currentHealth: number;
  totalHealth: number;
};

type ActorItemProps = {
  actor: ActorItemType;
};

export const convertToActor = (
  actor: Hero | CheckpointEnemy
): ActorItemType => {
  if (actor instanceof Hero) {
    return {
      actorId: actor.id,
      isHero: true,
      name: actor.name,
      type: display(actor.type),
      currentHealth: actor.health,
      totalHealth: actor.stats.vitality * HEALTH_PER_VITALITY,
    };
  }
  if (actor instanceof CheckpointEnemy) {
    return {
      actorId: actor.actorId,
      isHero: false,
      name: actor.name,
      type: actor.name,
      currentHealth: actor.health,
      totalHealth: actor.health,
    };
  }
  throw new Error(`Unknown actor type ${actor}`);
};

const ActorItem = ({ actor }: ActorItemProps) => {
  const healthRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const canvasW = 28;
  const canvasH = 8;

  useEffect(() => {
    const healthCtx = healthRef.current.getContext("2d")!;
    healthCtx.clearRect(0, 0, canvasW, canvasH);
    healthCtx.fillStyle = "lightgray";
    healthCtx.fillRect(0, 0, canvasW, canvasH);
    healthCtx.fillStyle = "red";
    healthCtx.fillRect(
      0,
      0,
      canvasW * (actor.currentHealth / actor.totalHealth),
      canvasH
    );
  }, [actor.currentHealth, actor.totalHealth]);

  const portrait = (isHero: boolean, type: string) => {
    if (isHero) {
      return HeroType[fromDisplay(type)].toLowerCase();
    }
    return "skeleton";
  };

  return (
    <div
      className={`actor-item${
        actor.currentHealth < 0 ? " actor-item--defeated" : ""
      }`}
    >
      <div
        className={`actor-item__portrait--${portrait(
          actor.isHero,
          actor.type
        )}`}
      ></div>
      <div className="actor-item__name">{actor.name}</div>
      <div className="actor-item__health">
        <canvas ref={healthRef} width={canvasW} height={canvasH}></canvas>
      </div>
    </div>
  );
};

export default ActorItem;
