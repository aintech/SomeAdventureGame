import React, { Component } from "react";
import { connect } from "react-redux";
import GameStats from "../../../../models/GameStats";
import { GUILD_SHARE } from "../../../../utils/Variables";
import Loader from "../../../loader/Loader";
import "./elder-display.scss";

type ElderDisplayProps = {
  stats: GameStats;
};

const ElderDisplay = ({ stats }: ElderDisplayProps) => {
  return (
    <div className="elder-display">
      <div>
        Известность городка <span className="elder-display__count">{stats.fame}</span>
      </div>
      <div>
        Доля городка в квестах <span className="elder-display__count">{GUILD_SHARE * 100}%</span>
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
