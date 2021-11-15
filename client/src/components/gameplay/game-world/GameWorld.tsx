import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { buildingClicked } from "../../../actions/Actions";
import Building from "../../../models/Building";
import GameWorldItem from "./game-world-item/GameWorldItem";
import "./game-world.scss";
import "./skybox.scss";

type GameWorldProps = {
  buildings: Building[];
  onBuildingClicked: (building: Building) => void;
};

//TODO: Объединить skybox и game-world

const GameWorld = ({ buildings, onBuildingClicked }: GameWorldProps) => {
  return (
    <div className="skybox">
      <div className="game-world">
        {buildings.map((building) => (
          <GameWorldItem key={building.type} building={building} onBuildingClicked={() => onBuildingClicked(building)} />
        ))}
      </div>
    </div>
  );
};

type GameWorldState = {
  buildings: Building[];
};

const mapStateToProps = ({ buildings }: GameWorldState) => {
  return { buildings };
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
