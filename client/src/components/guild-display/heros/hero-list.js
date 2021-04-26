import React from "react";
import { connect } from "react-redux";
import HeroItem from "./hero-item";
import { heroAssignedToQuest } from "../../../actions/actions.js";
import "./hero-list.scss";

const HeroList = ({
  heroes,
  chosenQuest,
  heroAssignedToQuest,
  heroesAssignedToQuest,
}) => {
  const assignToQuest = (hero) => {
    heroAssignedToQuest(hero);
  };

  return (
    <div className="hero-list">
      {heroes.map((hero, index) => {
        const enabled =
          heroesAssignedToQuest?.length < 4 &&
          heroesAssignedToQuest?.findIndex((h) => h.id === hero.id) === -1;

        return (
          <div key={hero.id}>
            <HeroItem
              hero={hero}
              index={index}
              chosenQuest={chosenQuest}
              onAssignToQuest={() => {
                assignToQuest(hero);
              }}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(HeroList);
