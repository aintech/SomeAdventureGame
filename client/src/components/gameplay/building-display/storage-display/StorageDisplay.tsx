import React, { Component } from "react";
import { BuildingType, toDisplay } from "../../../../models/Building";
import "./storage-display.scss";

const StorageDisplay = () => {
  return (
    <div className="storage-display">
      <div className="storage-display__name">{toDisplay(BuildingType.STORAGE)}</div>
    </div>
  );
};

class StorageDisplayContainer extends Component {
  render() {
    return <StorageDisplay />;
  }
}

export default StorageDisplayContainer;
