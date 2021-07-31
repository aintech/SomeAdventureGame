import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import Loader from "../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import { BuildingType, buildingTypeToName } from "../../../models/Building";
import "./training-ground-display.scss";

type TrainingGroundDisplayProps = {
  trainies: Hero[];
  traineeClicked: (visitor: Hero) => void;
  closeDisplay: () => void;
};

const TrainingGroundDisplay = ({ trainies, traineeClicked, closeDisplay }: TrainingGroundDisplayProps) => {
  const traineeClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    traineeClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "training-ground-display") {
      closeDisplay();
    }
  };

  return (
    <div className="training-ground-display" id="training-ground-display" onClick={clickHandler}>
      <button className="training-ground-display__btn--close" onClick={closeDisplay}></button>
      <div className="training-ground-display__container">
        <div className="training-ground-display__name">{buildingTypeToName(BuildingType.TRAINING_GROUND)}</div>
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
    </div>
  );
};

type TrainingGroundDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

class TrainingGroundDisplayContainer extends Component<TrainingGroundDisplayContainerProps> {
  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const trainies = heroes.filter((h) => h.activity!.type === HeroActivityType.TRAINING);

    return <TrainingGroundDisplay trainies={trainies} closeDisplay={closeDisplay} traineeClicked={heroClicked} />;
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
