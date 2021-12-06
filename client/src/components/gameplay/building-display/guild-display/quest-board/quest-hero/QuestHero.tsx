import { MouseEvent } from "react";
import Hero from "../../../../../../models/hero/Hero";
import HeroItem from "../../../../../shared/hero-item/HeroItem";
import "./quest-hero.scss";

type QuestHeroProps = {
  hero: Hero;
  assignHero: (hero: Hero) => void;
};

const QuestHero = ({ hero, assignHero }: QuestHeroProps) => {
  const onAssignedHero = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    assignHero(hero);
  };

  return (
    <div className="quest-hero">
      <HeroItem hero={hero} />
      <button className="quest-hero__btn--assign" onClick={(e) => onAssignedHero(e)}>
        <span className="quest-hero__btn--assign__title">назначить</span>
      </button>
    </div>
  );
};

export default QuestHero;
