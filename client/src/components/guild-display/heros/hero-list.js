import React from "react";
import { connect } from "react-redux";
import {
  heroAssignedToQuest,
  heroStatsChoosed,
} from "../../../actions/actions.js";
import HeroItem from "./hero-item";
import "./hero-list.scss";

const HeroList = ({
  heroes,
  chosenQuest,
  heroChoosed,
  heroAssignedToQuest,
  heroesAssignedToQuest,
}) => {
  const heroClickHandler = (hero, event) => {
    event.preventDefault();
    if (event.target.id === "hero_assigned_btn") {
      heroAssignedToQuest(hero);
    } else {
      heroChoosed(hero);
    }
  };

  return (
    <div className="hero-list">
      {heroes.map((hero, index) => {
        const enabled =
          heroesAssignedToQuest?.length < 4 &&
          heroesAssignedToQuest?.findIndex((h) => h.id === hero.id) === -1 &&
          !hero.embarkedQuest;

        return (
          <div key={hero.id}>
            <HeroItem
              hero={hero}
              index={index}
              chosenQuest={chosenQuest}
              onClickHandler={(event) => heroClickHandler(hero, event)}
              enabled={enabled}
            />
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = ({ chosenQuest }) => {
  return { chosenQuest };
};

const mapDispatchToProps = (dispatch) => ({
  heroAssignedToQuest: (hero) => {
    dispatch(heroAssignedToQuest(hero));
  },
  heroChoosed: (hero) => {
    dispatch(heroStatsChoosed(hero));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HeroList);
