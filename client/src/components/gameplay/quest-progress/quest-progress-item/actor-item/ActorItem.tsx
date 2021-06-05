import { useEffect, useRef } from "react";
import { HeroType, nameToType } from "../../../../../models/Hero";
import "./actor-item.scss";

export type ActorItemType = {
  actorId: number;
  isHero: boolean;
  name: string;
  type: string;
  healthFraction: number;
};

type ActorItemProps = {
  actor: ActorItemType;
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
    healthCtx.fillRect(0, 0, canvasW * actor.healthFraction, canvasH);
  }, [actor.healthFraction]);

  const portrait = (isHero: boolean, type: string) => {
    if (isHero) {
      return HeroType[nameToType(type)].toLowerCase();
    }
    return "skeleton";
  };

  return (
    <div className="actor-item">
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
