import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { buildingClicked } from "../../../actions/Actions";
import BuildingDetails from "../building-container/BuildingContainer";
import GameWorldItem from "./game-world-item/GameWorldItem";
import Building, { BuildingType } from "../../../models/Building";
import "./game-world.scss";

type GameWorldProps = {
  onBuildingClicked: (building: Building) => void;
  chosenBuilding: Building;
};

const GameWorld = ({ onBuildingClicked, chosenBuilding }: GameWorldProps) => {
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

      <BuildingDetails chosenBuilding={chosenBuilding} />
    </div>
  );
};

type GameWorldState = {
  chosenBuilding: Building;
};

const mapStateToProps = ({ chosenBuilding }: GameWorldState) => {
  return { chosenBuilding };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      onBuildingClicked: buildingClicked,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(GameWorld);
