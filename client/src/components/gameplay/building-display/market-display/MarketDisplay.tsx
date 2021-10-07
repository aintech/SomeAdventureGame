import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Equipment from "../../../../models/Equipment";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./market-display.scss";
import { MarketItem } from "./market-item/MarketItem";

type MarketDisplayProps = {
  visitors: Hero[];
  marketAssortment: Equipment[];
  visitorClicked: (visitor: Hero) => void;
};

const MarketDisplay = ({ visitors, marketAssortment, visitorClicked }: MarketDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  return (
    <div className="market-display">
      <div className="market-display__name">{toDisplay(BuildingType.MARKET)}</div>
      <div className="market-display__assortment-holder">
        <div className="market-display__assortment__list">
          <ul>
            {marketAssortment.map((assortment) => (
              <MarketItem key={assortment.id} item={assortment} />
            ))}
          </ul>
        </div>
      </div>
      <div className="market-display__visitors-holder">
        {visitors.map((visitor) => (
          <HeroItem
            key={visitor.id}
            hero={visitor}
            enabled={true}
            itemClickHandler={(event) => visitorClickHandler(visitor, event)}
          />
        ))}
      </div>
    </div>
  );
};

type MarketDisplayContainerProps = {
  heroes: Hero[];
  marketAssortment: Equipment[];
  heroClicked: (hero: Hero) => void;
};

class MarketDisplayContainer extends Component<MarketDisplayContainerProps> {
  render() {
    const { heroes, marketAssortment, heroClicked } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PURCHASING_EQUIPMENT);

    return <MarketDisplay visitors={visitors} marketAssortment={marketAssortment} visitorClicked={heroClicked} />;
  }
}

type MarketDisplayContainerState = {
  heroes: Hero[];
  marketAssortment: Equipment[];
};

const mapStateToProps = ({ heroes, marketAssortment }: MarketDisplayContainerState) => {
  return { heroes, marketAssortment };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketDisplayContainer);
