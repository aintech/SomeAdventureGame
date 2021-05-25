import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  heroAssignedToQuest,
  heroStatsChoosed,
} from "../../../actions/Actions";
import Hero from "../../../models/Hero";
import Quest from "../../../models/Quest";
import HeroItem from "./HeroItem";
import "./hero-list.scss";

type HeroListProps = {
  heroes: Hero[];
  chosenQuest: Quest;
  heroClicked: (hero: Hero) => void;
  assignHeroToQuest: (hero: Hero) => void;
  heroesAssignedToQuest: Hero[];
};

const HeroList = ({
  heroes,
  chosenQuest,
  heroClicked,
  assignHeroToQuest,
  heroesAssignedToQuest,
}: HeroListProps) => {
  const heroClickHandler = (
    hero: Hero,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (
      event.target instanceof HTMLButtonElement &&
      event.target.id === "hero_assigned_btn"
    ) {
      assignHeroToQuest(hero);
    } else {
      heroClicked(hero);
    }
  };

  return (
    <div className="hero-list">
      {heroes.map((hero) => {
        const enabled =
          heroesAssignedToQuest?.length < 4 &&
          heroesAssignedToQuest?.findIndex((h) => h.id === hero.id) === -1 &&
          !hero.embarkedQuest;

        return (
          <div key={hero.id}>
            <HeroItem
              hero={hero}
              chosenQuest={chosenQuest}
              itemClickHandler={(event) => heroClickHandler(hero, event)}
              enabled={enabled}
            />
          </div>
        );
      })}
    </div>
  );
};

type state = {
  chosenQuest: Quest;
};

const mapStateToProps = ({ chosenQuest }: state) => {
  return { chosenQuest };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  assignHeroToQuest: (hero: Hero) => {
    dispatch(heroAssignedToQuest(hero));
  },
  heroClicked: (hero: Hero) => {
    dispatch(heroStatsChoosed(hero));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HeroList);
