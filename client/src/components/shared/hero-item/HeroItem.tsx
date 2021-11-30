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
          <div>
            ATK &gt; <span className="hero-stat">{hero.stats.power + hero.equipStats.power}</span>
          </div>
          <div>
            DEF &gt; <span className="hero-stat">{hero.stats.defence + hero.equipStats.defence}</span>
          </div>
          <div>
            PSY &gt; <span className="hero-stat">{hero.stats.power + hero.equipStats.power}</span>
          </div>
          <div>
            VIT &gt; <span className="hero-stat">{hero.stats.vitality + hero.equipStats.vitality}</span>
          </div>
          <div>
            AGI &gt; <span className="hero-stat">{hero.stats.initiative + hero.equipStats.initiative}</span>
          </div>
        </div>
      </div>
      {hero.activity ? (
        <div>
          bits account: <span className="hero-item__bits">{hero.gold}</span>
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
