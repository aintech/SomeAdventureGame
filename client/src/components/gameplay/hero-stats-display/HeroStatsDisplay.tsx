import React, { MouseEvent, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { heroStatsDisplayClosed } from "../../../actions/Actions";
import { onDismissHero } from "../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import Equipment, { EquipmentType } from "../../../models/Equipment";
import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import { HeroType } from "../../../models/hero/HeroType";
import PersonageStats from "../../../models/PersonageStats";
import "./hero-stats-display.scss";

const calcEquipSurpluses = (equipment: Equipment[]): PersonageStats => {
  let power = 0;
  let defence = 0;
  let vitality = 0;
  let initiative = 0;

  for (const equip of equipment) {
    power += equip.stats.power;
    defence += equip.stats.defence;
    vitality += equip.stats.vitality;
    initiative -= equip.stats.initiative;
  }

  return new PersonageStats(power, defence, vitality, initiative);
};

type HeroStatsDisplayProps = {
  hero: Hero;
  heroStatsDisplayClosed: () => void;
  onDismissHero: (hero: Hero) => void;
};

const HeroStatsDisplay = ({
  hero,
  heroStatsDisplayClosed,
  onDismissHero,
}: HeroStatsDisplayProps) => {
  const healthRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const expRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);

  useEffect(() => {
    if (hero) {
      const healthBar = healthRef.current.getContext("2d")!;
      healthBar.clearRect(0, 0, 124, 21);
      healthBar.fillStyle = "red";
      healthBar.fillRect(0, 0, 124 * calcHealthFraction(hero), 21);

      const expBar = expRef.current.getContext("2d")!;
      expBar.clearRect(0, 0, 124, 21);
      expBar.fillStyle = "yellow";
      expBar.fillRect(0, 0, 124 * hero.progress, 21);
    }
  }, [hero]);

  if (!hero) {
    return null;
  }

  const dismissHero = (e: MouseEvent) => {
    e.stopPropagation();
    heroStatsDisplayClosed();
    onDismissHero(hero);
  };

  const equipmentSurplus = calcEquipSurpluses(hero.equipment);

  const weapon = hero.equipment.find((e) => e.type === EquipmentType.WEAPON);
  const armor = hero.equipment.find((e) => e.type === EquipmentType.ARMOR);
  const shield = hero.equipment.find((e) => e.type === EquipmentType.SHIELD);
  const accessory = hero.equipment.find(
    (e) => e.type === EquipmentType.ACCESSORY
  );

  const weaponStyle = `hero-stats__equipment-weapon${
    weapon ? "--" + weapon.imgAvatar : ""
  }`;
  const armorStyle = `hero-stats__equipment-armor${
    armor ? "--" + armor.imgAvatar : ""
  }`;
  const shieldStyle = `hero-stats__equipment-shield${
    shield ? "--" + shield.imgAvatar : ""
  }`;
  const accessoryStyle = `hero-stats__equipment-accessory${
    accessory ? "--" + accessory.imgAvatar : ""
  }`;

  let activity;
  switch (hero.activity!.type) {
    case HeroActivityType.IDLE:
      activity = "Отдыхает";
      break;
    case HeroActivityType.QUEST:
      activity = "Выполняет задание";
      break;
    case HeroActivityType.HEALER:
      activity = "Лечится у знахаря";
      break;
    default:
      activity = null;
  }

  return (
    <div className="hero-stats" onClick={heroStatsDisplayClosed}>
      <div className="hero-stats__bg"></div>
      <div className="hero-stats__portrait">
        <div className={`hero-stats__portrait--${HeroType[hero.type]}`}></div>
      </div>
      <button
        className={`hero-stats__dismiss-btn ${
          hero.activity!.type !== HeroActivityType.IDLE
            ? "hero-stats__dismiss-btn__hidden"
            : ""
        }`}
        onClick={(e) => dismissHero(e)}
      >
        <span className="hero-stats__dismiss-btn--text">Отпустить Героя</span>
      </button>
      <div className="hero-stats__activity">{activity}</div>
      <div className="hero-stats__gold">{hero.gold}</div>
      <div className="hero-stats__name">{hero.name}</div>
      <div className="hero-stats__level">{hero.level}</div>
      <div className="hero-stats__health">{hero.health}</div>
      <div className="hero-stats__experience">{hero.experience}</div>
      <div className="hero-stats__power">{hero.rawStats.power}</div>
      <div className="hero-stats__power-surplus">+{equipmentSurplus.power}</div>
      <div className="hero-stats__defence">{hero.rawStats.defence}</div>
      <div className="hero-stats__defence-surplus">
        +{equipmentSurplus.defence}
      </div>
      <div className="hero-stats__vitality">{hero.rawStats.vitality}</div>
      <div className="hero-stats__vitality-surplus">
        +{equipmentSurplus.vitality}
      </div>
      <div className="hero-stats__initiative">{hero.rawStats.initiative}</div>
      <div className="hero-stats__initiative-surplus">
        -{equipmentSurplus.initiative}
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
        ref={healthRef}
      ></canvas>
      <canvas
        className="hero-stats__experience-bar"
        width={124}
        height={21}
        ref={expRef}
      ></canvas>
    </div>
  );
};

const mapStateToProps = ({ chosenHero }: { chosenHero: Hero }) => {
  return { hero: chosenHero };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      heroStatsDisplayClosed,
      onDismissHero: onDismissHero(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(HeroStatsDisplay);
