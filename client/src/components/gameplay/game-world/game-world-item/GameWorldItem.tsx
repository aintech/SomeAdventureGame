import React from "react";
import { useDispatch } from "react-redux";
import { showTooltip } from "../../../../actions/Actions";
import Building, { BuildingType, toDisplay } from "../../../../models/Building";
import "./game-world-item.scss";

type GameWorldItemProps = {
  building: Building;
  onBuildingClicked: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const GameWorldItem = ({ building, onBuildingClicked }: GameWorldItemProps) => {
  const dispatch = useDispatch();
  return (
    <div
      className={`game-world__building-${BuildingType[building.type]}`}
      onClick={onBuildingClicked}
      onMouseOver={() => dispatch(showTooltip(true, `${toDisplay(building.type)} - ур. ${building.level}`))}
      onMouseOut={() => dispatch(showTooltip())}
    ></div>
  );
};

export default GameWorldItem;
