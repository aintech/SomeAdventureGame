import React from "react";
import { connect } from "react-redux";
import { buildingClicked } from "../../actions/actions";
import GuildDisplay from "../guild-display/guild-display";
import "./building-details.scss";

const BuildingDetails = ({ chosenBuilding, buildingClicked }) => {
  if (!chosenBuilding) {
    return null;
  }

  let display;
  switch (chosenBuilding.type) {
    case "tavern":
      display = <div>TAVERN WILL BE HERE</div>;
      break;

    case "guild":
      display = <GuildDisplay closeDisplay={buildingClicked} />;
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

const mapDispatchToProps = (dispatch) => ({
  buildingClicked: () => {
    dispatch(buildingClicked(null));
  },
});

export default connect(null, mapDispatchToProps)(BuildingDetails);
