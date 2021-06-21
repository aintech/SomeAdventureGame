import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { buildingClicked } from "../../../actions/Actions";
import Building, { BuildingType } from "../../../models/Building";
import GuildDisplay from "../guild-display/GuildDisplay";
import HealerDisplay from "../healer-display/HealerDisplay";
import TavernDisplay from "../tavern-display/TavernDisplay";
import "./building-container.scss";

type BuildingDetailsProps = {
  chosenBuilding: Building;
  hideBuildingDisplay: () => void;
};

const BuildingDetails = ({
  chosenBuilding,
  hideBuildingDisplay,
}: BuildingDetailsProps) => {
  if (!chosenBuilding) {
    return null;
  }

  let display;
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
    default:
      display = null;
      break;
  }

  return (
    <div className="building-container">
      <div>{display}</div>
    </div>
  );
};

type BuildingContainerState = {
  chosenBuilding: Building;
};

const mapStateToProps = ({ chosenBuilding }: BuildingContainerState) => {
  return { chosenBuilding };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideBuildingDisplay: () => {
    dispatch(buildingClicked(null));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(BuildingDetails);
