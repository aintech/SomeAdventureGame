import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { display, HeroType } from "../../../models/hero/HeroType";
import "./hero-item.scss";

type HeroItemProps = {
  hero: Hero;
  heroClickHandler: (hero: Hero) => void;
};

const HeroItem = ({ hero, heroClickHandler }: HeroItemProps) => {
  return (
    <div
      className="hero-item"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        heroClickHandler(hero);
      }}
    >
      <p className="hero-item__name">{hero.name}</p>
      <hr className="hero-item__divider" />
      <div className="hero-item__level-info">
        <p>{`${display(hero.type)}`}</p>
        <p>{hero.level.definition}</p>
      </div>

      <div className="hero-item__info">
        <div className="hero-item__visual">
          <div className="hero-item__portrait">
            <div className={`hero-item__portrait--${HeroType[hero.type].toLowerCase()}`}></div>
          </div>
          <div className="hero-item__bar">
            <div className="hero-item__bar_health" style={{ width: `${calcHealthFraction(hero) * 100}%` }}></div>
          </div>
          <div className="hero-item__bar">
            <div className="hero-item__bar_psy" style={{ width: `${100}%` }}></div>
          </div>
          <div className="hero-item__bar">
            <div className="hero-item__bar_lvl-progress" style={{ width: `${hero.level.progress * 100}%` }}></div>
          </div>
        </div>

        <div className="hero-item__stats">
          <div className="hero-stat">
            <span className="hero-stat__name">ATK</span>
            <span className="hero-stat__delim">▸</span>
            <span className="hero-stat__value">{hero.stats.power + hero.equipStats.power}</span>

            <span className="hero-stat__name">DEF</span>
            <span className="hero-stat__delim">▸</span>
            <span className="hero-stat__value">{hero.stats.defence + hero.equipStats.defence}</span>

            <span className="hero-stat__name">PSY</span>
            <span className="hero-stat__delim">▸</span>
            <span className="hero-stat__value">{hero.stats.power + hero.equipStats.power}</span>

            <span className="hero-stat__name">VIT</span>
            <span className="hero-stat__delim">▸</span>
            <span className="hero-stat__value">{hero.stats.vitality + hero.equipStats.vitality}</span>

            <span className="hero-stat__name">AGI</span>
            <span className="hero-stat__delim">▸</span>
            <span className="hero-stat__value">{hero.stats.initiative + hero.equipStats.initiative}</span>
          </div>
        </div>
      </div>
      {hero.activity ? (
        <div>
          dust account: <span className="hero-item__dust">{hero.gold}</span>
        </div>
      ) : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      heroClickHandler: heroStatsChoosed,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(HeroItem);
