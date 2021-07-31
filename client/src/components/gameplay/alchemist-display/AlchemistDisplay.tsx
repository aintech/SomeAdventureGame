import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import { BuildingType, buildingTypeToName } from "../../../models/Building";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import Loader from "../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./alchemist-display.scss";

type AlchemistDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
  closeDisplay: () => void;
};

const AlchemistDisplay = ({ visitors, visitorClicked, closeDisplay }: AlchemistDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "alchemist-display") {
      closeDisplay();
    }
  };

  return (
    <div className="alchemist-display" id="alchemist-display" onClick={clickHandler}>
      <button className="alchemist-display__btn--close" onClick={closeDisplay}></button>
      <div className="alchemist-display__container">
        <div className="alchemist-display__name">{buildingTypeToName(BuildingType.ALCHEMIST)}</div>
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
    </div>
  );
};

type AlchemistDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

class AlchemistDisplayContainer extends Component<AlchemistDisplayContainerProps> {
  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PURCHASING);

    return <AlchemistDisplay visitors={visitors} closeDisplay={closeDisplay} visitorClicked={heroClicked} />;
  }
}

type AlchemistDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: AlchemistDisplayContainerState) => {
  return { heroes };
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
