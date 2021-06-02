import React from "react";
import Building, { BuildingType } from "../../../../models/Building";
import "./game-world-item.scss";

type GameWorldItemProps = {
  building: Building;
  onBuildingClicked: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const GameWorldItem = ({ building, onBuildingClicked }: GameWorldItemProps) => {
  return (
    <div>
      <div
        className={`game-world__building-${BuildingType[building.type]}`}
        onClick={onBuildingClicked}
      ></div>
    </div>
  );
};

export default GameWorldItem;
