import React, { useEffect, useRef } from "react";
import { toGameplayScale } from "../../../utils/utils";
import { HEALTH_PER_VITALITY } from "../../../utils/variables";
import "./hero-item.scss";

const HeroItem = ({ hero, chosenQuest, onClickHandler, enabled, reward }) => {
  const healthCanvasRef = useRef(null);
  const experienceCanvasRef = useRef(null);
  const canvasW = toGameplayScale(80);
  const canvasH = toGameplayScale(10);

  useEffect(() => {
    const healthCtx = healthCanvasRef.current.getContext("2d");
    healthCtx.clearRect(0, 0, canvasW, canvasH);
    healthCtx.fillStyle = "lightgray";
    healthCtx.fillRect(0, 0, canvasW, canvasH);

    healthCtx.fillStyle = "red";
    healthCtx.fillRect(
      0,
      0,
      canvasW * (hero.health / (hero.vitalityTotal * HEALTH_PER_VITALITY)),
      canvasH
    );

    const experienceCtx = experienceCanvasRef.current.getContext("2d");
    experienceCtx.clearRect(0, 0, canvasW, canvasH);
    experienceCtx.fillStyle = "lightgray";
    experienceCtx.fillRect(0, 0, canvasW, canvasH);
    experienceCtx.fillStyle = "yellow";
    experienceCtx.fillRect(0, 0, canvasW * hero.progress, canvasH);
  });

  const typeName = hero.type === "warrior" ? "Воин" : "Маг";

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
    <div className={className} style={style} onClick={onClickHandler}>
      <button
        id="hero_assigned_btn"
        className="hero-item__btn--assign"
        style={assignBtnStyle}
      ></button>
      <div className={`hero-item__portrait--${hero.type}`}></div>
      <div className="hero-item__type-level">
        {typeName} <br></br> {hero.level} ур.
      </div>
      <canvas
        className="hero-item__health-bar"
        ref={healthCanvasRef}
        width={canvasW}
        height={canvasH}
      />
      <canvas
        className="hero-item__exp-bar"
        ref={experienceCanvasRef}
        width={canvasW}
        height={canvasH}
      />
      <div className="hero-item__name">{hero.name}</div>
      <div className="hero-item__power">{hero.powerTotal}</div>
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
