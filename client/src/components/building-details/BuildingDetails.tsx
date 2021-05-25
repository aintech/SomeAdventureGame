import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { buildingClicked } from "../../actions/Actions";
import Building, { BuildingType } from "../../models/Building";
import GuildDisplay from "../guild-display/GuildDisplay";
import "./building-details.scss";

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
      display = <div>TAVERN WILL BE HERE</div>;
      break;
    case BuildingType.GUILD:
      display = <GuildDisplay closeDisplay={hideBuildingDisplay} />;
      break;
    default:
      display = null;
      break;
  }

  return (
    <div className="building-details">
      <div className="building-details__content">{display}</div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  hideBuildingDisplay: () => {
    dispatch(buildingClicked(null));
  },
});

export default connect(null, mapDispatchToProps)(BuildingDetails);
