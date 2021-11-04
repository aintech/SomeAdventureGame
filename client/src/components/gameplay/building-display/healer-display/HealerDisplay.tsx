import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../../actions/Actions";
import { BuildingType, toDisplay } from "../../../../models/Building";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroItem from "../guild-display/heroes/hero-item/HeroItem";
import "./healer-display.scss";

type HealerDisplayProps = {
  visitors: Hero[];
  visitorClicked: (visitor: Hero) => void;
};

const HealerDisplay = ({ visitors, visitorClicked }: HealerDisplayProps) => {
  const visitorClickHandler = (hero: Hero, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    visitorClicked(hero);
  };

  return (
    <div className="healer-display">
      <div className="healer-display__name">{toDisplay(BuildingType.MEDBAY)}</div>
      <div className="healer-display__visitors-holder">
        {visitors.map((visitor) => (
          <HeroItem key={visitor.id} hero={visitor} enabled={true} itemClickHandler={(event) => visitorClickHandler(visitor, event)} />
        ))}
      </div>
    </div>
  );
};

type HealerDisplayContainerProps = {
  heroes: Hero[];
  heroClicked: (hero: Hero) => void;
};

class HealerDisplayContainer extends Component<HealerDisplayContainerProps> {
  render() {
    const { heroes, heroClicked } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.HEALING);

    return <HealerDisplay visitors={visitors} visitorClicked={heroClicked} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(HealerDisplayContainer);
