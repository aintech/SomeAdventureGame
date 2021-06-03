import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { buildingClicked } from "../../../actions/Actions";
import Building, { BuildingType } from "../../../models/Building";
import GameWorldItem from "./game-world-item/GameWorldItem";
import "./game-world.scss";

type GameWorldProps = {
  onBuildingClicked: (building: Building) => void;
};

const GameWorld = ({ onBuildingClicked }: GameWorldProps) => {
  const [buildings] = useState([
    new Building(1, BuildingType.TAVERN),
    new Building(2, BuildingType.GUILD),
  ]);

  return (
    <div className="game-world">
      {buildings.map((building) => (
        <div key={building.id}>
          <GameWorldItem
            building={building}
            onBuildingClicked={() => onBuildingClicked(building)}
          />
        </div>
      ))}
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      onBuildingClicked: buildingClicked,
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(GameWorld);
