import Hero, { HeroType, typeName } from "../../../../models/Hero";
import "./tavern-patron.scss";

type TavernPatronProps = {
  patron: Hero;
  hirePatron: (patron: Hero) => void;
};

const TavernPatron = ({ patron, hirePatron }: TavernPatronProps) => {
  return (
    <div className="tavern-patron">
      <div className="tavern-patron__portrait">
        <div
          className={`tavern-patron__portrait--${HeroType[patron.type]}`}
        ></div>
      </div>
      <div className="tavern-patron__name">{patron.name}</div>
      <div className="tavern-patron__type-level">{`${typeName(
        patron.type
      )} lvl. ${patron.level}`}</div>
      <div className="tavern-patron__power">{patron.stats.power}</div>
      <div className="tavern-patron__defence">{patron.stats.defence}</div>
      <div className="tavern-patron__vitality">{patron.stats.vitality}</div>
      <div className="tavern-patron__initiative">{patron.stats.initiative}</div>
      <button
        className="tavern-patron__btn--hire"
        onClick={() => hirePatron(patron)}
      >
        <span className="tavern-patron__btn--hire__price">{patron.gold} g</span>
      </button>
    </div>
  );
};

export default TavernPatron;
