import React, { Component } from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroContainer from "../../../shared/hero-container/HeroContainer";
import "./training-ground-display.scss";

type TrainingGroundDisplayProps = {
  trainies: Hero[];
};

const TrainingGroundDisplay = ({ trainies }: TrainingGroundDisplayProps) => {
  return (
    <div className="training-ground-display">
      {trainies.map((trainee) => (
        <HeroContainer key={trainee.id} hero={trainee} />
      ))}
    </div>
  );
};

type TrainingGroundDisplayContainerProps = {
  heroes: Hero[];
};

class TrainingGroundDisplayContainer extends Component<TrainingGroundDisplayContainerProps> {
  render() {
    const { heroes } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const trainies = heroes.filter((h) => h.activity!.type === HeroActivityType.TRAINING);

    return <TrainingGroundDisplay trainies={trainies} />;
  }
}

type TrainingGroundDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: TrainingGroundDisplayContainerState) => {
  return { heroes };
};

export default connect(mapStateToProps)(TrainingGroundDisplayContainer);
