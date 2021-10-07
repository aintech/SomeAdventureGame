import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./training-ground-display.scss";

type TrainingGroundDisplayProps = {
  trainies: Hero[];
  traineeClicked: (visitor: Hero) => void;
};

const TrainingGroundDisplay = ({ trainies, traineeClicked }: TrainingGroundDisplayProps) => {
  const traineeClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    traineeClicked(hero);
  };

  return (
    <div className="training-ground-display">
      <div className="training-ground-display__name">{toDisplay(BuildingType.TRAINING_GROUND)}</div>
      <div className="training-ground-display__trainies-holder">
        {trainies.map((trainee) => (
          <HeroItem
            key={trainee.id}
            hero={trainee}
            enabled={true}
            itemClickHandler={(event) => traineeClickHandler(trainee, event)}
          />
        ))}
      </div>
    </div>
  );
};

type TrainingGroundDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
};

class TrainingGroundDisplayContainer extends Component<TrainingGroundDisplayContainerProps> {
  render() {
    const { heroes, heroClicked } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const trainies = heroes.filter((h) => h.activity!.type === HeroActivityType.TRAINING);

    return <TrainingGroundDisplay trainies={trainies} traineeClicked={heroClicked} />;
  }
}

type TrainingGroundDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: TrainingGroundDisplayContainerState) => {
  return { heroes };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainingGroundDisplayContainer);
