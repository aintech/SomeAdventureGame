import React, { Component } from "react";
import "./tavern-display.scss";

type TavernDisplayProps = {
  closeDisplay: () => void;
};

class TavernDisplay extends Component<TavernDisplayProps> {
  render() {
    return <div>TAVERN</div>;
  }
}

export default TavernDisplay;
