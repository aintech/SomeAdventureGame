import React, { MouseEvent } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { buildingClicked } from "../../../actions/Actions";
import Building, { BuildingType } from "../../../models/Building";
import BlacksmithDisplay from "./blacksmith-display/BlacksmithDisplay";
import GuildDisplay from "./guild-display/GuildDisplay";
import HealerDisplay from "./healer-display/HealerDisplay";
import AlchemistDisplay from "./alchemist-display/AlchemistDisplay";
import TavernDisplay from "./tavern-display/TavernDisplay";
import TempleDisplay from "./temple-display/TempleDisplay";
import TrainingGroundDisplay from "./training-ground-display/TrainingGroundDisplay";
import TreasuryDisplay from "./treasury-display/TreasuryDisplay";
import "./building-display.scss";
import StablesDisplay from "./stables-display/StablesDisplay";
import StorageDisplay from "./storage-display/StorageDisplay";
import MarketDisplay from "./market-display/MarketDisplay";
import { convertDuration } from "../../../utils/Utils";

type BuildingDisplayProps = {
  chosenBuilding: Building;
  hideBuildingDisplay: () => void;
};

const BuildingDisplay = ({ chosenBuilding, hideBuildingDisplay }: BuildingDisplayProps) => {
  if (!chosenBuilding) {
    return null;
  }

  const upgradeBuilding = (e: MouseEvent) => {
    e.stopPropagation();
    console.log("Upgrade");
  };

  const upgradeBtn = chosenBuilding.upgrade ? (
    <button className="building-display__btn-upgrade" onClick={upgradeBuilding}>
      &uarr; Up to lvl <span className="building-display__btn-upgrade__span">{chosenBuilding.level + 1}</span> =={" "}
      <span className="building-display__btn-upgrade__span">{chosenBuilding.upgrade.cost}</span> g ::{" "}
      <span className="building-display__btn-upgrade__span">{convertDuration(chosenBuilding.upgrade.duration)}</span>
    </button>
  ) : null;

  let display = displayByType(chosenBuilding.type);
  return (
    <div className="building-display" onClick={hideBuildingDisplay}>
      <div className="building-display__container" onClick={(e) => e.stopPropagation()}>
        <button className="building-display__btn-close" onClick={hideBuildingDisplay}></button>
        {display}
        {upgradeBtn}
      </div>
    </div>
  );
};

const displayByType = (type: BuildingType) => {
  switch (type) {
    case BuildingType.TAVERN:
      return <TavernDisplay />;
    case BuildingType.GUILD:
      return <GuildDisplay />;
    case BuildingType.HEALER:
      return <HealerDisplay />;
    case BuildingType.TREASURY:
      return <TreasuryDisplay />;
    case BuildingType.TRAINING_GROUND:
      return <TrainingGroundDisplay />;
    case BuildingType.ALCHEMIST:
      return <AlchemistDisplay />;
    case BuildingType.TEMPLE:
      return <TempleDisplay />;
    case BuildingType.BLACKSMITH:
      return <BlacksmithDisplay />;
    case BuildingType.STABLES:
      return <StablesDisplay />;
    case BuildingType.STORAGE:
      return <StorageDisplay />;
    case BuildingType.MARKET:
      return <MarketDisplay />;
    default:
      throw new Error(`Unknown building type ${BuildingType[type]}`);
  }
};

type BuildingDisplayState = {
  chosenBuilding: Building;
};

const mapStateToProps = ({ chosenBuilding }: BuildingDisplayState) => {
  return { chosenBuilding };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideBuildingDisplay: () => {
    dispatch(buildingClicked());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BuildingDisplay);
