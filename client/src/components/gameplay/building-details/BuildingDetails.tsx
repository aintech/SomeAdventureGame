import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { buildingClicked } from "../../../actions/Actions";
import Building, { BuildingType } from "../../../models/Building";
import BlacksmithDisplay from "../blacksmith-display/BlacksmithDisplay";
import GuildDisplay from "../guild-display/GuildDisplay";
import HealerDisplay from "../healer-display/HealerDisplay";
import AlchemistDisplay from "../alchemist-display/AlchemistDisplay";
import TavernDisplay from "../tavern-display/TavernDisplay";
import TempleDisplay from "../temple-display/TempleDisplay";
import TrainingGroundDisplay from "../training-ground-display/TrainingGroundDisplay";
import TreasuryDisplay from "../treasury-display/TreasuryDisplay";
import "./building-details.scss";

type BuildingDetailsProps = {
  chosenBuilding: Building;
  hideBuildingDisplay: () => void;
};

const BuildingDetails = ({ chosenBuilding, hideBuildingDisplay }: BuildingDetailsProps) => {
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
    default:
      throw new Error(`Unknown building type ${BuildingType[chosenBuilding.type]}`);
  }

  return (
    <div className="building-details">
      <div>{display}</div>
    </div>
  );
};

type BuildingDetailsState = {
  chosenBuilding: Building;
};

const mapStateToProps = ({ chosenBuilding }: BuildingDetailsState) => {
  return { chosenBuilding };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideBuildingDisplay: () => {
    dispatch(buildingClicked(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BuildingDetails);
