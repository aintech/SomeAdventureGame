import React from "react";
import Building from "../../models/Building";
import "./building-item.scss";

type BuildingItemProps = {
  building: Building;
  onBuildingClicked: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const BuildingItem = ({ building, onBuildingClicked }: BuildingItemProps) => {
  return (
    <div>
      <div
        className={`gameplay__world__btn--building-${building.type}`}
        onClick={onBuildingClicked}
      ></div>
    </div>
  );
};

export default BuildingItem;
