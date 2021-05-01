import React, { useEffect, useRef } from "react";
import { toGameplayScale } from "../../../utils/utils";
import "./hero-item.scss";

const HeroItem = ({ hero, chosenQuest, onAssignToQuest, enabled, reward }) => {
  const canvasRef = useRef(null);
  const canvasW = toGameplayScale(80);
  const canvasH = toGameplayScale(10);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, canvasW * hero.progress, canvasH);
  });

  const classDesc = hero.type === "warrior" ? "Воин" : "Маг";

  const assignBtnStyle = {
    display: chosenQuest && enabled ? "block" : "none",
  };

  const style = {
    opacity: enabled ? 1 : 0.5,
  };

  const rewardStyle = {
    display: reward ? "block" : "none",
  };

  return (
    <div className="hero-item" style={style}>
      <button
        className="hero-item__btn--assign"
        style={assignBtnStyle}
        onClick={onAssignToQuest}
      ></button>
      <div className={`hero-item__portrait--${hero.type}`}></div>
      <div className="hero-item__type-level">
        {classDesc} <br></br> {hero.level} ур.
      </div>
      <canvas
        className="hero-item__exp-bar"
        ref={canvasRef}
        width={canvasW}
        height={canvasH}
      />
      <div className="hero-item__name">{hero.name}</div>
      <div className="hero-item__power">{hero.power}</div>
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
