import React, { Component } from "react";
import { connect } from "react-redux";
import { BuildingType, toDisplay } from "../../../../models/Building";
import GameStats from "../../../../models/GameStats";
import { GUILD_SHARE } from "../../../../utils/Variables";
import Loader from "../../../loader/Loader";
import "./treasury-display.scss";

type TreasuryDisplayProps = {
  stats: GameStats;
};

const TreasuryDisplay = ({ stats }: TreasuryDisplayProps) => {
  return (
    <div className="treasury-display">
      <div className="treasury-display__name">{toDisplay(BuildingType.TREASURY)}</div>
      <div className="treasury-display__stats">
        <div>Уровень славы городка {stats.fame}</div>
        <div>Золота в сокровищнице {stats.gold} g</div>
        <div>Доля гильдии в квестах {GUILD_SHARE * 100}% </div>
      </div>
    </div>
  );
};

type TreasuryDisplayContainerProps = {
  stats: GameStats;
};

class TreasuryDisplayContainer extends Component<TreasuryDisplayContainerProps> {
  render() {
    const { stats } = this.props;

    if (!stats) {
      return <Loader message={"Fetching for stats..."} />;
    }

    return <TreasuryDisplay stats={stats} />;
  }
}

type TreasuryDisplayState = {
  stats: GameStats;
};

const mapStateToProps = ({ stats }: TreasuryDisplayState) => {
  return { stats };
};

export default connect(mapStateToProps)(TreasuryDisplayContainer);
