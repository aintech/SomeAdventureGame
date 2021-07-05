import React from "react";
import { useDispatch } from "react-redux";
import { showTooltip } from "../../../../actions/Actions";
import Building, {
  BuildingType,
  buildingTypeToName,
} from "../../../../models/Building";
import "./game-world-item.scss";

type GameWorldItemProps = {
  building: Building;
  onBuildingClicked: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const GameWorldItem = ({ building, onBuildingClicked }: GameWorldItemProps) => {
  const dispatch = useDispatch();
  return (
    <div>
      <div
        className={`game-world__building-${BuildingType[building.type]}`}
        onClick={onBuildingClicked}
        onMouseOver={() =>
          dispatch(showTooltip(true, buildingTypeToName(building.type)))
        }
        onMouseOut={() => dispatch(showTooltip())}
      ></div>
    </div>
  );
};

export default GameWorldItem;
