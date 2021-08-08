import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { heroStatsDisplayClosed, showConfirmDialog } from "../../../actions/Actions";
import { onDismissHero } from "../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../hoc/WithApiService";
import { EquipmentType, getEquipmentStats } from "../../../models/Equipment";
import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivity";
import { HeroType } from "../../../models/hero/HeroType";
import { convertDuration, millisToSecs } from "../../../utils/Utils";
import "./hero-stats-display.scss";

type HeroStatsDisplayProps = {
  hero: Hero;
  heroStatsDisplayClosed: () => void;
  onDismissHero: (hero: Hero) => void;
};

//FIXME: Если герой закончил текущую активность текст активности не обновляется
const HeroStatsDisplay = ({ hero, heroStatsDisplayClosed, onDismissHero }: HeroStatsDisplayProps) => {
  const dispatch = useDispatch();
  const healthRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const expRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
  const [activityTime, setActivityTime] = useState("");

  const updateActivityTime = () => {
    if (hero?.activity?.duration) {
      const remained = millisToSecs(
        hero.activity.startedAt.getTime() + hero.activity.duration * 1000 - new Date().getTime()
      );
      setActivityTime(convertDuration(remained + 1));
    } else {
      setActivityTime("");
    }
  };

  useEffect(() => {
    if (hero) {
      const healthBar = healthRef.current.getContext("2d")!;
      healthBar.clearRect(0, 0, 124, 21);
      healthBar.fillStyle = "red";
      healthBar.fillRect(0, 0, 124 * calcHealthFraction(hero), 21);

      const expBar = expRef.current.getContext("2d")!;
      expBar.clearRect(0, 0, 124, 21);
      expBar.fillStyle = "yellow";
      expBar.fillRect(0, 0, 124 * hero.level.progress, 21);

      if (hero?.activity?.duration) {
        const remained = millisToSecs(
          hero.activity.startedAt.getTime() + hero.activity.duration * 1000 - new Date().getTime()
        );
        setActivityTime(convertDuration(remained + 1));
      } else {
        setActivityTime("");
      }
    }
  }, [hero]);

  useEffect(() => {
    let timer = setInterval(() => updateActivityTime(), 1000);

    return () => {
      clearInterval(timer);
    };
  });

  if (!hero) {
    return null;
  }

  const dismissHero = (e: MouseEvent) => {
    e.preventDefault();
    heroStatsDisplayClosed();
    onDismissHero(hero);
  };

  const equipmentSurplus = getEquipmentStats(hero.equipment);

  const weapon = hero.equipment.find((e) => e.type === EquipmentType.WEAPON)!;
  const armor = hero.equipment.find((e) => e.type === EquipmentType.ARMOR)!;
  const shield = hero.equipment.find((e) => e.type === EquipmentType.SHIELD);
  const accessory = hero.equipment.find((e) => e.type === EquipmentType.ACCESSORY);

  const weaponStyle = `hero-stats__equipment-weapon--${weapon.imgAvatar}`;
  const armorStyle = `hero-stats__equipment-armor--${armor.imgAvatar}`;
  const shieldStyle = `hero-stats__equipment-shield${shield ? "--" + shield.imgAvatar : ""}`;
  const accessoryStyle = `hero-stats__equipment-accessory${accessory ? "--" + accessory.imgAvatar : ""}`;

  const stars = [
    [],
    [
      <i key={0} className="material-icons guild-display__btn--show-unabled-icon">
        star_rate
      </i>,
    ],
    [
      <i key={0} className="material-icons guild-display__btn--show-unabled-icon">
        star_rate
      </i>,
      <i key={1} className="material-icons guild-display__btn--show-unabled-icon">
        star_rate
      </i>,
    ],
    [
      <i key={0} className="material-icons guild-display__btn--show-unabled-icon">
        star_rate
      </i>,
      <i key={1} className="material-icons guild-display__btn--show-unabled-icon">
        star_rate
      </i>,
      <i key={2} className="material-icons guild-display__btn--show-unabled-icon">
        star_rate
      </i>,
    ],
  ];

  return (
    <div className="hero-stats" onClick={heroStatsDisplayClosed}>
      <div className="hero-stats__bg"></div>
      <div className="hero-stats__portrait">
        <div className={`hero-stats__portrait--${HeroType[hero.type]}`}></div>
      </div>
      <button
        className={`hero-stats__dismiss-btn ${
          hero.activity!.type === HeroActivityType.QUEST ? "hero-stats__dismiss-btn__hidden" : ""
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dispatch(
            showConfirmDialog(`${hero.name} отправится на поиски новых приключений в другие гильдии`, dismissHero, e)
          );
        }}
      >
        <span className="hero-stats__dismiss-btn--text">
          {" "}
          <span style={{ color: "red" }}>X</span> Отпустить
        </span>
      </button>
      <div className="hero-stats__activity">
        {hero.activity!.description} {activityTime}
      </div>
      <div className="hero-stats__gold">{hero.gold}</div>
      <div className="hero-stats__name">{hero.name}</div>
      <div className="hero-stats__level">
        {hero.level.lvl} - {hero.level.definition}
      </div>
      <div className="hero-stats__health">{hero.health}</div>
      <div className="hero-stats__experience">{hero.level.experience}</div>
      <div className="hero-stats__power">{hero.stats.power}</div>
      <div className="hero-stats__power-surplus">+{equipmentSurplus.power}</div>
      <div className="hero-stats__defence">{hero.stats.defence}</div>
      <div className="hero-stats__defence-surplus">+{equipmentSurplus.defence}</div>
      <div className="hero-stats__vitality">{hero.stats.vitality}</div>
      <div className="hero-stats__vitality-surplus">+{equipmentSurplus.vitality}</div>
      <div className="hero-stats__initiative">{hero.stats.initiative}</div>
      <div className="hero-stats__initiative-surplus">-{equipmentSurplus.initiative}</div>
      <div className="hero-stats__equipment">
        <div className={weaponStyle}>
          <div className="hero-stats__equipment--stats">
            <div className="hero-stats__equipment--stats-tier">{stars[weapon.tier]}</div>
            <div className="hero-stats__equipment--stats-level">lv. {weapon.level}</div>
          </div>
        </div>
        <div className={armorStyle}>
          <div className="hero-stats__equipment--stats">
            <div className="hero-stats__equipment--stats-tier">{stars[armor.tier]}</div>
            <div className="hero-stats__equipment--stats-level">lv. {armor.level}</div>
          </div>
        </div>
        <div className={shieldStyle}>
          <div className="hero-stats__equipment--stats">
            <div className="hero-stats__equipment--stats-level">{shield ? `lv. ${shield.level}` : null}</div>
          </div>
        </div>
        <div className={accessoryStyle}>
          <div className="hero-stats__equipment--stats">
            <div className="hero-stats__equipment--stats-level">{accessory ? `lv. ${accessory.level}` : null}</div>
          </div>
        </div>
      </div>
      <div className="hero-stats__items">
        <div className="hero-stats__items--header">Инвентарь</div>
        <div className="hero-stats__items--list">
          <li>
            {hero.items
              .filter((i) => i.amount > 0)
              .map((i) => {
                return (
                  <ul key={i.id}>
                    {i.name} - {i.amount}
                  </ul>
                );
              })}
          </li>
        </div>
      </div>
      <div className="hero-stats__perks">
        <div className="hero-stats__perks--header">Перки</div>
        <div className="hero-stats__perks--list">
          <li>
            {hero.perks.map((perk) => {
              return (
                <ul key={perk.id}>
                  <span className="hero-stats__perks--name">{perk.name}</span> - {perk.description}
                </ul>
              );
            })}
          </li>
        </div>
      </div>
      <div className="hero-stats__skills">
        <div className="hero-stats__skills--header">Умения</div>
        <div className="hero-stats__skills--list">
          <li>
            {hero.skills.map((skill) => {
              return (
                <ul
                  key={skill.name}
                  className={`${skill.level > hero.level.lvl ? "hero-stats__skills--disabled" : ""}`}
                >
                  <span className="hero-stats__skills--name">
                    {skill.name} ({skill.level} ур)
                  </span>{" "}
                  - {skill.description}
                </ul>
              );
            })}
          </li>
        </div>
      </div>

      <canvas className="hero-stats__health-bar" width={124} height={21} ref={healthRef}></canvas>
      <canvas className="hero-stats__experience-bar" width={124} height={21} ref={expRef}></canvas>
    </div>
  );
};

const mapStateToProps = ({ chosenHero }: { chosenHero: Hero }) => {
  return { hero: chosenHero };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      heroStatsDisplayClosed,
      onDismissHero: onDismissHero(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(HeroStatsDisplay);
