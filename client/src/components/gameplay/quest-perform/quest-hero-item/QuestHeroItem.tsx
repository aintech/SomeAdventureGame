import React, { useEffect, useRef } from "react";
import HealIconImg from "../../../../img/quest-perform/battle-process/heal-icon.png";
import Hero, { calcHealthFraction } from "../../../../models/hero/Hero";
import { HeroType } from "../../../../models/hero/HeroType";
import "./quest-hero-item.scss";

// TODO: визуально дизейблить героев без здоровья

// TODO: золото распределяется по героям после завершения задания
type QuestHeroItemProps = {
  hero: Hero;
  itemClickHandler?: (event: React.MouseEvent<HTMLDivElement>) => void;
  reward?: { gold: number; experience: number };
  hitted?: boolean;
  healed?: boolean;
};

const QuestHeroItem = ({ hero, itemClickHandler, hitted, healed, reward }: QuestHeroItemProps) => {
  const healthRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const expRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);

  const canvasW = 143;
  const canvasH = 16;

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

  const style = {
    opacity: hero.health > 0 ? 1 : 0.5,
  };

  const rewardStyle = {
    display: reward ? "block" : "none",
  };

  // Приходится делать две анимации, т.к. когда надо проиграть анимацию
  // которая уже была последней код не понимает что её надо переигрывать
  // из-за этого приходится делать вторую идентичную анимацию чтобы переключится на неё
  const classes = `
      quest-hero-item
      ${reward ? "" : " hero-item--hoverable"}
      ${hitted === undefined ? "" : hitted ? " hero-item--hitted" : " hero-item--hitted2"} 
      ${hero.health <= 0 ? "defeated" : ""}`;

  const healIconClass = `
      heal-icon
      ${healed === undefined ? "" : healed ? " heal-icon_playing" : " heal-icon_playing2"}`;

  const power = hero.stats.power + hero.equipStats.power;

  return (
    <div className={classes} style={style} onClick={itemClickHandler}>
      <div className={`quest-hero-item__portrait--${HeroType[hero.type].toLowerCase()}`}></div>
      <canvas className="quest-hero-item__health-bar" ref={healthRef} width={canvasW} height={canvasH} />
      <canvas className="quest-hero-item__exp-bar" ref={expRef} width={canvasW} height={canvasH} />
      <div className="quest-hero-item__name">{hero.name}</div>
      <div className="quest-hero-item__power">{power}</div>
      <div className="quest-hero-item__reward--experience" style={rewardStyle}>
        {reward?.experience}
      </div>
      <img src={HealIconImg} alt="heal" className={healIconClass}></img>
    </div>
  );
};

export default QuestHeroItem;
