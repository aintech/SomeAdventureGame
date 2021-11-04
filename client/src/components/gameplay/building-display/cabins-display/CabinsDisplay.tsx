import React, { Component } from "react";
import { connect } from "react-redux";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import Loader from "../../../loader/Loader";
import "./cabins-display.scss";

type CabinsDisplayProps = {
  heroes: Hero[];
};

const CabinsDisplay = ({ heroes }: CabinsDisplayProps) => {
  return (
    <div className="cabins-display">
      <div className="cabins-display__name">{toDisplay(BuildingType.CABINS)}</div>
      <div className="cabins-display__heroes">HEROES WILL BE HERE</div>
    </div>
  );
};

type CabinsDisplayContainerProps = {
  heroes: Hero[];
};

class CabinsDisplayContainer extends Component<CabinsDisplayContainerProps> {
  render() {
    const { heroes } = this.props;

    if (!heroes) {
      return <Loader message={"Fetching heroes..."} />;
    }

    return <CabinsDisplay heroes={heroes} />;
  }
}

type CabinsDisplayState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: CabinsDisplayState) => {
  return { heroes };
};

export default connect(mapStateToProps)(CabinsDisplayContainer);
