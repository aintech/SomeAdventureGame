import React, { Component } from "react";
import { connect } from "react-redux";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import Loader from "../../../loader/Loader";
import "./dwellings-display.scss";

type DwellingsDisplayProps = {
  habitants: Hero[];
};

const DwellingsDisplay = ({ habitants }: DwellingsDisplayProps) => {
  return (
    <div className="dwellings-display">
      <div className="dwellings-display__name">{toDisplay(BuildingType.DWELLINGS)}</div>
      <div className="dwellings-display__habitants">HABITANTS WILL BE HERE</div>
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
