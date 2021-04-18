import React from "react";
import "./building-item.scss";

const BuildingItem = ({ building, onBuildingClicked }) => {
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
