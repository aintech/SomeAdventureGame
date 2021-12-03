import React, { Component, useState } from "react";
import { connect } from "react-redux";
import Equipment from "../../../../models/Equipment";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroContainer from "../../../shared/hero-container/HeroContainer";
import "./market-display.scss";
import { MarketItem } from "./market-item/MarketItem";

type MarketDisplayProps = {
  visitors: Hero[];
  marketAssortment: Equipment[];
};

const MarketDisplay = ({ visitors, marketAssortment }: MarketDisplayProps) => {
  const [showVisitors, setShowVisitors] = useState(false);

  return (
    <div className="market-display">
      <div className={`market-display__assortment-holder ${showVisitors ? "" : "market-display_active"}`}>
        <div className="market-display__assortment__list">
          <ul>
            {marketAssortment.map((assortment) => (
              <MarketItem key={assortment.id} item={assortment} />
            ))}
          </ul>
        </div>
      </div>
      <div className={`market-display__visitors-holder  ${!showVisitors ? "" : "market-display_active"}`}>
        {visitors.map((visitor) => (
          <HeroContainer key={visitor.id} hero={visitor} />
        ))}
      </div>
      <div className="market-display__controls">
        <button
          className={`market-display__controls_btn ${showVisitors ? "" : "market-display__controls--inactive"}`}
          onClick={() => setShowVisitors(false)}
        >
          товары
        </button>
        <button
          className={`market-display__controls_btn ${!showVisitors && visitors.length > 0 ? "" : "market-display__controls--inactive"}`}
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

type MarketDisplayContainerProps = {
  heroes: Hero[];
  marketAssortment: Equipment[];
};

class MarketDisplayContainer extends Component<MarketDisplayContainerProps> {
  render() {
    const { heroes, marketAssortment } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PURCHASING_EQUIPMENT);

    return <MarketDisplay visitors={visitors} marketAssortment={marketAssortment} />;
  }
}

type MarketDisplayContainerState = {
  heroes: Hero[];
  marketAssortment: Equipment[];
};

const mapStateToProps = ({ heroes, marketAssortment }: MarketDisplayContainerState) => {
  return { heroes, marketAssortment };
};

export default connect(mapStateToProps)(MarketDisplayContainer);
