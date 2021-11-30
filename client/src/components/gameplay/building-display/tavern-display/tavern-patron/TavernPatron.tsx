import { MouseEvent } from "react";
import Hero from "../../../../../models/hero/Hero";
import HeroItem from "../../../../shared/HeroItem";
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
      <HeroItem hero={patron} />
      <button className="tavern-patron__btn--hire" onClick={(e) => onHirePatron(e)}>
        <span className="tavern-patron__btn--hire__price">
          Нанять <span className="tavern-patron__btn--hire__bits">{patron.gold}</span>
        </span>
      </button>
    </div>
  );
};

export default TavernPatron;
