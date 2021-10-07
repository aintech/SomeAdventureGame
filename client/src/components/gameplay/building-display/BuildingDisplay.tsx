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
import StorageDisplayContainer from "./storage-display/StorageDisplay";
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
      display = <TavernDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.GUILD:
      display = <GuildDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.HEALER:
      display = <HealerDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.TREASURY:
      display = <TreasuryDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.TRAINING_GROUND:
      display = <TrainingGroundDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.ALCHEMIST:
      display = <AlchemistDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.TEMPLE:
      display = <TempleDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.BLACKSMITH:
      display = <BlacksmithDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.STABLES:
      display = <StablesDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.STORAGE:
      display = <StorageDisplayContainer closeDisplay={hideBuildingDisplay} />;
      break;
    case BuildingType.MARKET:
      display = <MarketDisplay closeDisplay={hideBuildingDisplay} />;
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
