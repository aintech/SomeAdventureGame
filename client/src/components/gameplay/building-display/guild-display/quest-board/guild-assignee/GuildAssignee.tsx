import { MouseEvent } from "react";
import Hero from "../../../../../../models/hero/Hero";
import HeroItem from "../../../../../shared/hero-item/HeroItem";
import "./guild-assignee.scss";

type GuildAssigneeProps = {
  hero: Hero;
  assignHero: (hero: Hero) => void;
};

const GuildAssignee = ({ hero, assignHero }: GuildAssigneeProps) => {
  const onAssignedHero = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    assignHero(hero);
  };

  return (
    <div className="guild-assignee">
      <HeroItem hero={hero} />
      <button className="guild-assignee__btn--assign" onClick={(e) => onAssignedHero(e)}>
        <span className="guild-assignee__btn--assign__title">назначить</span>
      </button>
    </div>
  );
};

export default GuildAssignee;
