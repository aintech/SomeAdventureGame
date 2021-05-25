import React, { useEffect, useRef, MouseEvent } from "react";
import Hero, {
  calcHealthFraction,
  HeroType,
  typeName,
} from "../../../models/Hero";
import Quest from "../../../models/Quest";
import { toGameplayScale } from "../../../utils/Utils";
import "./hero-item.scss";

type HeroItemProps = {
  hero: Hero;
  chosenQuest?: Quest;
  itemClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void;
  enabled: boolean;
  reward?: { gold: number; experience: number };
};

const HeroItem = ({
  hero,
  chosenQuest,
  itemClickHandler,
  enabled,
  reward,
}: HeroItemProps) => {
  const healthRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const expRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const canvasW = toGameplayScale(80);
  const canvasH = toGameplayScale(10);

  useEffect(() => {
    const healthCtx = healthRef.current.getContext("2d")!;
    healthCtx.clearRect(0, 0, canvasW, canvasH);
    healthCtx.fillStyle = "lightgray";
    healthCtx.fillRect(0, 0, canvasW, canvasH);
    healthCtx.fillStyle = "red";
    healthCtx.fillRect(0, 0, canvasW * calcHealthFraction(hero), canvasH);

    const expCtx = expRef.current.getContext("2d")!;
    expCtx.clearRect(0, 0, canvasW, canvasH);
    expCtx.fillStyle = "lightgray";
    expCtx.fillRect(0, 0, canvasW, canvasH);
    expCtx.fillStyle = "yellow";
    expCtx.fillRect(0, 0, canvasW * hero.progress, canvasH);
  });

  const assignBtnStyle = {
    display: chosenQuest && enabled ? "block" : "none",
  };

  const style = {
    opacity: enabled ? 1 : 0.5,
  };

  const rewardStyle = {
    display: reward ? "block" : "none",
  };

  const className = `hero-item ${reward ? "" : "hero-item--hoverable"}`;

  return (
    <div className={className} style={style} onClick={itemClickHandler}>
      <button
        id="hero_assigned_btn"
        className="hero-item__btn--assign"
        style={assignBtnStyle}
      ></button>
      <div className={`hero-item__portrait--${HeroType[hero.type]}`}></div>
      <div className="hero-item__type-level">
        {typeName(hero.type)} <br></br> {hero.level} ур.
      </div>
      <canvas
        className="hero-item__health-bar"
        ref={healthRef}
        width={canvasW}
        height={canvasH}
      />
      <canvas
        className="hero-item__exp-bar"
        ref={expRef}
        width={canvasW}
        height={canvasH}
      />
      <div className="hero-item__name">{hero.name}</div>
      <div className="hero-item__power">{hero.stats.power}</div>
      <div className="hero-item__health">{hero.health}</div>
      <div className="hero-item__gold">{hero.gold}</div>
      <div className="hero-item__reward--gold" style={rewardStyle}>
        {reward?.gold}
      </div>
      <div className="hero-item__reward--experience" style={rewardStyle}>
        {reward?.experience}
      </div>
    </div>
  );
};

export default HeroItem;
