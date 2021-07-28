import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import { BuildingType, buildingTypeToName } from "../../../models/Building";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import Loader from "../../loader/Loader";
import HeroItem from "../guild-display/heroes/HeroItem";
import "./shaman-display.scss";

type ShamanDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
  closeDisplay: () => void;
};

const ShamanDisplay = ({ visitors, visitorClicked, closeDisplay }: ShamanDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "shaman-display") {
      closeDisplay();
    }
  };

  return (
    <div className="shaman-display" id="shaman-display" onClick={clickHandler}>
      <button className="shaman-display__btn--close" onClick={closeDisplay}></button>
      <div className="shaman-display__container">
        <div className="shaman-display__name">{buildingTypeToName(BuildingType.SHAMAN)}</div>
        <div className="shaman-display__visitors-holder">
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

type ShamanDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

class ShamanDisplayContainer extends Component<ShamanDisplayContainerProps> {
  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PRAYING);

    return <ShamanDisplay visitors={visitors} closeDisplay={closeDisplay} visitorClicked={heroClicked} />;
  }
}

type ShamanDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: ShamanDisplayContainerState) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(ShamanDisplayContainer);
