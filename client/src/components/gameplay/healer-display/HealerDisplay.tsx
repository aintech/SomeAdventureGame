import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import Loader from "../../loader/Loader";
import HeroItem from "../guild-display/heroes/HeroItem";
import { BuildingType, buildingTypeToName } from "../../../models/Building";
import "./healer-display.scss";

type HealerDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
  closeDisplay: () => void;
};

const HealerDisplay = ({
  visitors,
  visitorClicked,
  closeDisplay,
}: HealerDisplayProps) => {
  const visitorClickHandler = (
    hero: Hero,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "healer-display") {
      closeDisplay();
    }
  };

  return (
    <div className="healer-display" id="healer-display" onClick={clickHandler}>
      <button
        className="healer-display__btn--close"
        onClick={closeDisplay}
      ></button>
      <div className="healer-display__container">
        <div className="healer-display__name">
          {buildingTypeToName(BuildingType.HEALER)}
        </div>
        <div className="healer-display__visitors-holder">
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

type HealerDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
  closeDisplay: () => void;
};

class HealerDisplayContainer extends Component<HealerDisplayContainerProps> {
  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter(
      (h) => h.activity!.type === HeroActivityType.HEALER
    );

    return (
      <HealerDisplay
        visitors={visitors}
        closeDisplay={closeDisplay}
        visitorClicked={heroClicked}
      />
    );
  }
}

type HealerDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: HealerDisplayContainerState) => {
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HealerDisplayContainer);
