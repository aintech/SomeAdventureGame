import { MouseEvent } from "react";
import Hero from "../../../../../models/hero/Hero";
import { display, HeroType } from "../../../../../models/hero/HeroType";
import "./tavern-patron.scss";

type TavernPatronProps = {
  patron: Hero;
  hirePatron: (patron: Hero) => void;
};

const TavernPatron = ({ patron, hirePatron }: TavernPatronProps) => {
  const onHirePatron = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    hirePatron(patron);
  };

  return (
    <div className="tavern-patron">
      <div className="tavern-patron__container">
        <p className="tavern-patron__name">{patron.name}</p>
        <hr className="tavern-patron__divider" />
        <div className="tavern-patron__level-info">
          <p>{`${display(patron.type)}`}</p>
          <p>Ур. {patron.level.lvl}</p>
        </div>

        <div className="tavern-patron__info">
          <div className="tavern-patron__portrait">
            <div className={`tavern-patron__portrait--${HeroType[patron.type].toLowerCase()}`}></div>
          </div>

          <div className="tavern-patron__stats">
            <div>
              ATK &gt; <span className="patron-stat">{patron.stats.power}</span>
            </div>
            <div>
              DEF &gt; <span className="patron-stat">{patron.stats.defence}</span>
            </div>
            <div>
              PSY &gt; <span className="patron-stat">{patron.stats.power}</span>
            </div>
            <div>
              VIT &gt; <span className="patron-stat">{patron.stats.vitality}</span>
            </div>
            <div>
              AGI &gt; <span className="patron-stat">{patron.stats.initiative}</span>
            </div>
          </div>
        </div>
      </div>
      <button className="tavern-patron__btn--hire" onClick={(e) => onHirePatron(e)}>
        <span className="tavern-patron__btn--hire__price">{patron.gold} c</span>
      </button>
    </div>
  );
};

export default TavernPatron;
