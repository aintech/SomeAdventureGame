import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Item from "../../../../models/Item";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./alchemist-display.scss";
import { AlchemistItem } from "./alchemist-item/AlchemistItem";

type AlchemistDisplayProps = {
  visitors: Hero[];
  alchemistAssortment: Item[];
  visitorClicked: (visitor: Hero) => void;
};

const AlchemistDisplay = ({ visitors, alchemistAssortment, visitorClicked }: AlchemistDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  return (
    <div className="alchemist-display">
      <div className="alchemist-display__name">{toDisplay(BuildingType.ALCHEMIST)}</div>
      <div className="alchemist-display__assortment-holder">
        <div className="alchemist-display__assortment__list">
          <ul>
            {alchemistAssortment.map((assortment) => (
              <AlchemistItem key={assortment.id} item={assortment} />
            ))}
          </ul>
        </div>
      </div>
      <div className="alchemist-display__visitors-holder">
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

type AlchemistDisplayContainerProps = {
  heroes: Hero[];
  alchemistAssortment: Item[];
  heroClicked: (hero: Hero) => void;
};

class AlchemistDisplayContainer extends Component<AlchemistDisplayContainerProps> {
  render() {
    const { heroes, alchemistAssortment, heroClicked } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PURCHASING_POTIONS);

    return (
      <AlchemistDisplay visitors={visitors} alchemistAssortment={alchemistAssortment} visitorClicked={heroClicked} />
    );
  }
}

type AlchemistDisplayContainerState = {
  heroes: Hero[];
  alchemistAssortment: Item[];
};

const mapStateToProps = ({ heroes, alchemistAssortment }: AlchemistDisplayContainerState) => {
  return { heroes, alchemistAssortment };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(AlchemistDisplayContainer);
