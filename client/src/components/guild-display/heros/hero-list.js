import React from "react";
import { connect } from "react-redux";
import HeroItem from "./hero-item";
import { heroAssignedToQuest } from "../../../actions/actions.js";
import "./hero-list.scss";

const HeroList = ({ heroes, chosenQuest, heroAssignedToQuest }) => {
  const assignToQuest = (hero) => {
    heroAssignedToQuest(hero);
  };

  return (
    <div className="hero-list">
      {heroes.map((hero, index) => {
        return (
          <div key={hero.id}>
            <HeroItem
              hero={hero}
              index={index}
              chosenQuest={chosenQuest}
              onAssignToQuest={() => {
                assignToQuest(hero);
              }}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(HeroList);
