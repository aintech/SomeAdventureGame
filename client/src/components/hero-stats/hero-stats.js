import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { heroStatsClosed } from "../../actions/actions";
import { HEALTH_PER_VITALITY } from "../../utils/variables";
import "./hero-stats.scss";

const calcSurplus = (equipment) => {
  let power = 0;
  let defence = 0;
  let vitality = 0;
  let initiative = 0;

  for (const equip of equipment) {
    power += +equip.power;
    defence += +equip.defence;
    vitality += +equip.vitality;
    initiative -= +equip.initiative;
  }

  return { power, defence, vitality, initiative };
};

/**
 * TODO: Выводить инициативу
 */
const HeroStats = ({ hero, heroStatsClosed }) => {
  const healthCanvasRef = useRef(null);
  const experienceCanvasRef = useRef(null);

  useEffect(() => {
    if (hero) {
      const healthBar = healthCanvasRef.current.getContext("2d");
      healthBar.clearRect(0, 0, 124, 21);
      healthBar.fillStyle = "red";
      healthBar.fillRect(
        0,
        0,
        124 * (hero.health / (hero.vitality * HEALTH_PER_VITALITY)),
        21
      );

      const experienceBar = experienceCanvasRef.current.getContext("2d");
      experienceBar.clearRect(0, 0, 124, 21);
      experienceBar.fillStyle = "yellow";
      experienceBar.fillRect(0, 0, 124 * hero.progress, 21);
    }
  }, [hero]);

  if (!hero) {
    return null;
  }

  const equipmentSurplus = calcSurplus(hero.equipment);

  const weapon = hero.equipment.find((e) => e.type === "weapon");
  const armor = hero.equipment.find((e) => e.type === "armor");
  const shield = hero.equipment.find((e) => e.type === "shield");
  const accessory = hero.equipment.find((e) => e.type === "accessory");

  const weaponStyle = `hero-stats__equipment-weapon${
    weapon ? "--" + weapon.avatar : ""
  }`;
  const armorStyle = `hero-stats__equipment-armor${
    armor ? "--" + armor.avatar : ""
  }`;
  const shieldStyle = `hero-stats__equipment-shield${
    shield ? "--" + shield.avatar : ""
  }`;
  const accessoryStyle = `hero-stats__equipment-accessory${
    accessory ? "--" + accessory.avatar : ""
  }`;

  return (
    <div className="hero-stats" onClick={heroStatsClosed}>
      <div className="hero-stats__bg"></div>
      <div className="hero-stats__portrait">
        <div className={`hero-stats__portrait--${hero.type}`}></div>
      </div>
      <div className="hero-stats__gold">{hero.gold}</div>
      <div className="hero-stats__name">{hero.name}</div>
      <div className="hero-stats__level">{hero.level}</div>
      <div className="hero-stats__health">{hero.health}</div>
      <div className="hero-stats__experience">{hero.experience}</div>
      <div className="hero-stats__power">{hero.powerRaw}</div>
      <div className="hero-stats__power-surplus">+{equipmentSurplus.power}</div>
      <div className="hero-stats__defence">{hero.defenceRaw}</div>
      <div className="hero-stats__defence-surplus">
        +{equipmentSurplus.defence}
      </div>
      <div className="hero-stats__vitality">{hero.vitalityRaw}</div>
      <div className="hero-stats__vitality-surplus">
        +{equipmentSurplus.vitality}
      </div>
      <div className="hero-stats__equipment">
        <div className={weaponStyle}>
          <div className="hero-stats__equipment--level">
            {weapon ? `lv. ${weapon.level}` : null}
          </div>
        </div>
        <div className={armorStyle}>
          <div className="hero-stats__equipment--level">
            {armor ? `lv. ${armor.level}` : null}
          </div>
        </div>
        <div className={shieldStyle}>
          <div className="hero-stats__equipment--level">
            {shield ? `lv. ${shield.level}` : null}
          </div>
        </div>
        <div className={accessoryStyle}>
          <div className="hero-stats__equipment--level">
            {accessory ? `lv. ${accessory.level}` : null}
          </div>
        </div>
      </div>

      <canvas
        className="hero-stats__health-bar"
        width={124}
        height={21}
        ref={healthCanvasRef}
      ></canvas>
      <canvas
        className="hero-stats__experience-bar"
        width={124}
        height={21}
        ref={experienceCanvasRef}
      ></canvas>
    </div>
  );
};

const mapStateToProps = ({ chosenHero }) => {
  return { hero: chosenHero };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ heroStatsClosed }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(HeroStats);
