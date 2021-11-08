import React, { useEffect, useRef } from "react";
import Hero, { calcHealthFraction } from "../../../../../../models/hero/Hero";
import { display, HeroType } from "../../../../../../models/hero/HeroType";
import Quest from "../../../../../../models/Quest";
import { toGameplayScale } from "../../../../../../utils/Utils";
import HealIconImg from "../../../../../../img/quest-perform/battle-process/heal-icon.png";
import "./hero-item.scss";

type HeroItemProps = {
  hero: Hero;
  chosenQuest?: Quest;
  itemClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void;
  enabled: boolean;
  reward?: { gold: number; experience: number };
  embarkedLimit?: boolean;
  hitted?: boolean;
  healed?: boolean;
};

const HeroItem = ({ hero, chosenQuest, itemClickHandler, enabled, hitted, healed, reward, embarkedLimit }: HeroItemProps) => {
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
    expCtx.fillRect(0, 0, canvasW * hero.level.progress, canvasH);
  }, [hero, hero.health, canvasH, canvasW]);

  const assignBtnStyle = {
    display: chosenQuest && enabled && !embarkedLimit ? "block" : "none",
  };

  const style = {
    opacity: enabled ? 1 : 0.5,
  };

  const rewardStyle = {
    display: reward ? "block" : "none",
  };

  const className = `hero-item${reward ? "" : " hero-item--hoverable"}${hitted ? " hero-item--hitted" : ""}`;

  const healClass = `hero-item__heal-icon${healed ? " heal-icon_playing" : ""}`;

  const power = hero.stats.power + hero.equipStats.power;

  return (
    <div className={className} style={style} onClick={itemClickHandler}>
      <button id="hero_assigned_btn" className="hero-item__btn--assign" style={assignBtnStyle}>
        Назначить
      </button>
      <div className={`hero-item__portrait--${HeroType[hero.type].toLowerCase()}`}></div>
      <div className="hero-item__type-level">
        {display(hero.type)} <br></br> {hero.level.definition}
      </div>
      <canvas className="hero-item__health-bar" ref={healthRef} width={canvasW} height={canvasH} />
      <canvas className="hero-item__exp-bar" ref={expRef} width={canvasW} height={canvasH} />
      <div className="hero-item__name">{hero.name}</div>
      <div className="hero-item__power">{power}</div>
      <div className="hero-item__health">{hero.health}</div>
      <div className="hero-item__gold">{hero.gold}</div>
      <div className="hero-item__reward--gold" style={rewardStyle}>
        {reward?.gold}
      </div>
      <div className="hero-item__reward--experience" style={rewardStyle}>
        {reward?.experience}
      </div>
      <img src={HealIconImg} alt="heal" className={healClass}></img>
    </div>
  );
};

export default HeroItem;
