import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import Hero from "../../../../models/hero/Hero";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./dwellings-display.scss";

type DwellingsDisplayProps = {
  habitants: Hero[];
  habitantClicked: (hero: Hero) => void;
};

const DwellingsDisplay = ({ habitants, habitantClicked }: DwellingsDisplayProps) => {
  const habitantClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    habitantClicked(hero);
  };

  return (
    <div className="blacksmith-display">
      {habitants.map((habitant) => (
        <HeroItem key={habitant.id} hero={habitant} enabled={true} itemClickHandler={(event) => habitantClickHandler(habitant, event)} />
      ))}
    </div>
  );
};

type DwellingsDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
};

class DwellingsDisplayContainer extends Component<DwellingsDisplayContainerProps> {
  render() {
    const { heroes, heroClicked } = this.props;

    if (!heroes) {
      return <Loader message={"Fetching habitants..."} />;
    }

    return <DwellingsDisplay habitants={heroes} habitantClicked={heroClicked} />;
  }
}

type DwellingsDisplayState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: DwellingsDisplayState) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(DwellingsDisplayContainer);
