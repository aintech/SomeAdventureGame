import React from "react";
import "./hero-item.scss";

const HeroItem = ({
  hero,
  index,
  chosenQuest,
  onAssignToQuest,
  isAssigned,
}) => {
  const classDesc = hero.class === "warrior" ? "Воин" : "Маг";

  const assignBtnStyle = {
    display: chosenQuest && !isAssigned ? "block" : "none",
  };

  const style = {
    opacity: isAssigned ? 0.5 : 1,
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
    </div>
  );
};

export default HeroItem;
