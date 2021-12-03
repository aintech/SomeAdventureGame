import React, { Component, useState } from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Item from "../../../../models/Item";
import Loader from "../../../loader/Loader";
import HeroContainer from "../../../shared/hero-container/HeroContainer";
import "./alchemist-display.scss";
import { AlchemistItem } from "./alchemist-item/AlchemistItem";

type AlchemistDisplayProps = {
  visitors: Hero[];
  alchemistAssortment: Item[];
};

const AlchemistDisplay = ({ visitors, alchemistAssortment }: AlchemistDisplayProps) => {
  const [showVisitors, setShowVisitors] = useState(false);

  return (
    <div className="alchemist-display">
      <div className={`alchemist-display__assortment-holder ${showVisitors ? "" : "alchemist-display_active"}`}>
        <div className="alchemist-display__assortment__list">
          <ul>
            {alchemistAssortment.map((assortment) => (
              <AlchemistItem key={assortment.id} item={assortment} />
            ))}
          </ul>
        </div>
      </div>
      <div className={`alchemist-display__visitors-holder  ${!showVisitors ? "" : "alchemist-display_active"}`}>
        {visitors.map((visitor) => (
          <HeroContainer key={visitor.id} hero={visitor} />
        ))}
      </div>
      <div className="alchemist-display__controls">
        <button
          className={`alchemist-display__controls_btn ${showVisitors ? "" : "alchemist-display__controls--inactive"}`}
          onClick={() => setShowVisitors(false)}
        >
          товары
        </button>
        <button
          className={`alchemist-display__controls_btn ${!showVisitors && visitors.length > 0 ? "" : "alchemist-display__controls--inactive"}`}
          onClick={() => {
            if (visitors.length > 0) {
              setShowVisitors(true);
            }
          }}
        >
          посетители
        </button>
      </div>
    </div>
  );
};

type AlchemistDisplayContainerProps = {
  heroes: Hero[];
  alchemistAssortment: Item[];
};

class AlchemistDisplayContainer extends Component<AlchemistDisplayContainerProps> {
  render() {
    const { heroes, alchemistAssortment } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PURCHASING_POTIONS);

    return <AlchemistDisplay visitors={visitors} alchemistAssortment={alchemistAssortment} />;
  }
}

type AlchemistDisplayContainerState = {
  heroes: Hero[];
  alchemistAssortment: Item[];
};

const mapStateToProps = ({ heroes, alchemistAssortment }: AlchemistDisplayContainerState) => {
  return { heroes, alchemistAssortment };
};

export default connect(mapStateToProps)(AlchemistDisplayContainer);
