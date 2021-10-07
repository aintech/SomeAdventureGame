import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./blacksmith-display.scss";

type BlacksmithDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
};

const BlacksmithDisplay = ({ visitors, visitorClicked }: BlacksmithDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  return (
    <div className="blacksmith-display">
      <div className="blacksmith-display__name">{toDisplay(BuildingType.BLACKSMITH)}</div>
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
  );
};

type BlacksmithDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
};

class BlacksmithDisplayContainer extends Component<BlacksmithDisplayContainerProps> {
  render() {
    const { heroes, heroClicked } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.UPGRADING_EQUIPMENT);

    return <BlacksmithDisplay visitors={visitors} visitorClicked={heroClicked} />;
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
