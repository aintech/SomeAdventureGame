import React, { Component } from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/hero/Hero";
import Loader from "../../../loader/Loader";
import DwellingHabitant from "./dwelling-habitant/DwellingHabitanat";
import "./dwellings-display.scss";

type DwellingsDisplayProps = {
  habitants: Hero[];
};

const DwellingsDisplay = ({ habitants }: DwellingsDisplayProps) => {
  return (
    <div className="dwellings-display">
      {habitants.map((habitant) => (
        <DwellingHabitant key={habitant.id} habitant={habitant} />
      ))}
    </div>
  );
};

type DwellingsDisplayContainerProps = {
  heroes: Hero[];
};

class DwellingsDisplayContainer extends Component<DwellingsDisplayContainerProps> {
  render() {
    const { heroes } = this.props;

    if (!heroes) {
      return <Loader message={"Fetching habitants..."} />;
    }

    return <DwellingsDisplay habitants={heroes} />;
  }
}

type DwellingsDisplayState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: DwellingsDisplayState) => {
  return { heroes };
};

export default connect(mapStateToProps)(DwellingsDisplayContainer);
