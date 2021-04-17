import React from "react";
import { scaleToGameplay } from "../../../utils/utils.js";
import "./hero-item.scss";

const HeroItem = ({ hero, index, chosenQuest, onAssignToQuest }) => {
  const top = `${scaleToGameplay(index * 115 + 80)}px`;

  const classDisplay = hero.class === "warrior" ? "Воин" : "Волшебник";

  const assignBtnStyle = {
    display: chosenQuest ? "block" : "none",
  };

  return (
    <div className="hero-item" style={{ top: top }}>
      <button
        className="hero-item__btn--assign"
        style={assignBtnStyle}
        onClick={onAssignToQuest}
      ></button>
      <div className={`hero-item__portrait--${hero.class}`}></div>
      <div className="hero-item__class-level">
        {classDisplay} {hero.level} ур.
      </div>
      <div className="hero-item__name">{hero.name}</div>
      <div className="hero-item__power">Сила: {hero.power}</div>
      <div className="hero-item__health">HP: {hero.health}</div>
    </div>
  );
};

export default HeroItem;
