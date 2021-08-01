import React, { Component } from "react";
import { connect } from "react-redux";
import { BuildingType, buildingTypeToName } from "../../../models/Building";
import GameStats from "../../../models/GameStats";
import { GUILD_SHARE } from "../../../utils/variables";
import Loader from "../../loader/Loader";
import "./treasury-display.scss";

type TreasuryDisplayProps = {
  stats: GameStats;
  closeDisplay: () => void;
};

const TreasuryDisplay = ({ stats, closeDisplay }: TreasuryDisplayProps) => {
  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "treasury-display") {
      closeDisplay();
    }
  };

  return (
    <div className="treasury-display" id="treasury-display" onClick={clickHandler}>
      <button className="treasury-display__btn--close" onClick={closeDisplay}></button>
      <div className="treasury-display__container">
        <div className="treasury-display__name">{buildingTypeToName(BuildingType.TREASURY)}</div>
        <div className="treasury-display__stats">
          <div>Уровень славы городка {stats.fame}</div>
          <div>Золота в сокровищнице {stats.gold} g</div>
          <div>Доля гильдии в квестах {GUILD_SHARE * 100}% </div>
        </div>
      </div>
    </div>
  );
};

type TreasuryDisplayContainerProps = {
  stats: GameStats;
  closeDisplay: () => void;
};

class TreasuryDisplayContainer extends Component<TreasuryDisplayContainerProps> {
  render() {
    const { stats, closeDisplay } = this.props;

    if (!stats) {
      return <Loader message={"Fetching for stats..."} />;
    }

    return <TreasuryDisplay stats={stats} closeDisplay={closeDisplay} />;
  }
}

type TreasuryDisplayState = {
  stats: GameStats;
};

const mapStateToProps = ({ stats }: TreasuryDisplayState) => {
  return { stats };
};

export default connect(mapStateToProps)(TreasuryDisplayContainer);
