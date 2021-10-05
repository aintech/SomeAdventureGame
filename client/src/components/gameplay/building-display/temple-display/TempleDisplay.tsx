import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./temple-display.scss";

type TempleDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
  closeDisplay: () => void;
};

const TempleDisplay = ({ visitors, visitorClicked, closeDisplay }: TempleDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "temple-display") {
      closeDisplay();
    }
  };

  return (
    <div className="temple-display" id="temple-display" onClick={clickHandler}>
      <button className="temple-display__btn--close" onClick={closeDisplay}></button>
      <div className="temple-display__container">
        <div className="temple-display__name">{toDisplay(BuildingType.TEMPLE)}</div>
        <div className="temple-display__visitors-holder">
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

type TempleDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

class TempleDisplayContainer extends Component<TempleDisplayContainerProps> {
  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.PRAYING);

    return <TempleDisplay visitors={visitors} closeDisplay={closeDisplay} visitorClicked={heroClicked} />;
  }
}

type TempleDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: TempleDisplayContainerState) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(TempleDisplayContainer);
