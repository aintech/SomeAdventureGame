import React from "react";
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

type BuildingDisplayProps = {
  chosenBuilding: Building;
  hideBuildingDisplay: () => void;
};

const BuildingDisplay = ({ chosenBuilding, hideBuildingDisplay }: BuildingDisplayProps) => {
  if (!chosenBuilding) {
    return null;
  }

  let display = null;
  switch (chosenBuilding.type) {
    case BuildingType.TAVERN:
      display = <TavernDisplay />;
      break;
    case BuildingType.GUILD:
      display = <GuildDisplay />;
      break;
    case BuildingType.HEALER:
      display = <HealerDisplay />;
      break;
    case BuildingType.TREASURY:
      display = <TreasuryDisplay />;
      break;
    case BuildingType.TRAINING_GROUND:
      display = <TrainingGroundDisplay />;
      break;
    case BuildingType.ALCHEMIST:
      display = <AlchemistDisplay />;
      break;
    case BuildingType.TEMPLE:
      display = <TempleDisplay />;
      break;
    case BuildingType.BLACKSMITH:
      display = <BlacksmithDisplay />;
      break;
    case BuildingType.STABLES:
      display = <StablesDisplay />;
      break;
    case BuildingType.STORAGE:
      display = <StorageDisplay />;
      break;
    case BuildingType.MARKET:
      display = <MarketDisplay />;
      break;
    default:
      throw new Error(`Unknown building type ${BuildingType[chosenBuilding.type]}`);
  }

  return (
    <div className="building-display" onClick={hideBuildingDisplay}>
      <button className="building-display__btn-close" onClick={hideBuildingDisplay}></button>
      <div className="building-display__container" onClick={(e) => e.stopPropagation()}>
        {display}
      </div>
    </div>
  );
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
