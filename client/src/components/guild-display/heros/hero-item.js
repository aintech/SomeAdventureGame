import React from "react";
import "./hero-item.scss";

const HeroItem = ({ hero, chosenQuest, onAssignToQuest, enabled, reward }) => {
  const classDesc = hero.class === "warrior" ? "Воин" : "Маг";

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
      <div className={`hero-item__portrait--${hero.class}`}></div>
      <div className="hero-item__class-level">
        {classDesc} <br></br> {hero.level} ур.
      </div>
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
