import React from "react";

const BuildingItem = ({ building, onBuildingClicked }) => {
  return (
    <div
      className={`gameplay__world__btn--building`}
      style={{
        left: `${building.position.x}px`,
        top: `${building.position.y}px`,
      }}
    >
      <div
        className={`gameplay__world__btn--building-${building.type}`}
        onClick={onBuildingClicked}
      ></div>
    </div>
  );
};

export default BuildingItem;
