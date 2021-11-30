import React, { Component } from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroContainer from "../../../shared/hero-container/HeroContainer";
import "./blacksmith-display.scss";

type BlacksmithDisplayProps = {
  visitors: Hero[];
};

const BlacksmithDisplay = ({ visitors }: BlacksmithDisplayProps) => {
  return (
    <div className="blacksmith-display">
      {visitors.map((visitor) => (
        <HeroContainer key={visitor.id} hero={visitor} />
      ))}
    </div>
  );
};

type BlacksmithDisplayContainerProps = {
  heroes: Hero[];
};

class BlacksmithDisplayContainer extends Component<BlacksmithDisplayContainerProps> {
  render() {
    const { heroes } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.UPGRADING_EQUIPMENT);

    return <BlacksmithDisplay visitors={visitors} />;
  }
}

type BlacksmithDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: BlacksmithDisplayContainerState) => {
  return { heroes };
};

export default connect(mapStateToProps)(BlacksmithDisplayContainer);
