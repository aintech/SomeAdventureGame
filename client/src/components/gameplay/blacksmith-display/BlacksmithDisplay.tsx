import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import { BuildingType, buildingTypeToName } from "../../../models/Building";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import Loader from "../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./blacksmith-display.scss";

type BlacksmithDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
  closeDisplay: () => void;
};

const BlacksmithDisplay = ({ visitors, visitorClicked, closeDisplay }: BlacksmithDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "blacksmith-display") {
      closeDisplay();
    }
  };

  return (
    <div className="blacksmith-display" id="blacksmith-display" onClick={clickHandler}>
      <button className="blacksmith-display__btn--close" onClick={closeDisplay}></button>
      <div className="blacksmith-display__container">
        <div className="blacksmith-display__name">{buildingTypeToName(BuildingType.BLACKSMITH)}</div>
        <div className="blacksmith-display__visitors-holder">
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

type BlacksmithDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

class BlacksmithDisplayContainer extends Component<BlacksmithDisplayContainerProps> {
  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PURCHASING);

    return <BlacksmithDisplay visitors={visitors} closeDisplay={closeDisplay} visitorClicked={heroClicked} />;
  }
}

type BlacksmithDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: BlacksmithDisplayContainerState) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(BlacksmithDisplayContainer);
