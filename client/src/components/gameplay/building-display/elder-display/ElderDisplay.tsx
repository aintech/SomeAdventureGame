import React, { Component } from "react";
import { connect } from "react-redux";
import { BuildingType, toDisplay } from "../../../../models/Building";
import GameStats from "../../../../models/GameStats";
import Loader from "../../../loader/Loader";
import "./elder-display.scss";

type ElderDisplayProps = {
  stats: GameStats;
};

const ElderDisplay = ({ stats }: ElderDisplayProps) => {
  return (
    <div className="elder-display">
      <div className="elder-display__name">{toDisplay(BuildingType.POWER_STATION)}</div>
      <div className="elder-display__stats">
        <div>Генерируется энергии - 50 mV</div>
        <div>Используемая энергия - 30 mV</div>
      </div>
    </div>
  );
};

type ElderDisplayContainerProps = {
  stats: GameStats;
};

class ElderDisplayContainer extends Component<ElderDisplayContainerProps> {
  render() {
    const { stats } = this.props;

    if (!stats) {
      return <Loader message={"Fetching for stats..."} />;
    }

    return <ElderDisplay stats={stats} />;
  }
}

type ElderDisplayState = {
  stats: GameStats;
};

const mapStateToProps = ({ stats }: ElderDisplayState) => {
  return { stats };
};

export default connect(mapStateToProps)(ElderDisplayContainer);
