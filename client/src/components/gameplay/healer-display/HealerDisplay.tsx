import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { heroStatsChoosed } from "../../../actions/Actions";
import { onHeroOccupation } from "../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import Hero, { calcHealthFraction } from "../../../models/hero/Hero";
import { HeroOccupationType } from "../../../models/hero/HeroOccupationType";
import Loader from "../../loader/Loader";
import HeroItem from "../guild-display/heroes/HeroItem";
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
        <div className="healer-display__name">Домик врачевателя</div>
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
  onHeroOccupation: (hero: Hero, occupation: HeroOccupationType) => void;
  closeDisplay: () => void;
};

class HealerDisplayContainer extends Component<HealerDisplayContainerProps> {
  checkIfHeroesNeedHealer() {
    const idleDamagedHeroes = this.props.heroes.filter(
      (h) =>
        h.occupation === HeroOccupationType.IDLE && calcHealthFraction(h) < 1
    );

    for (const hero of idleDamagedHeroes) {
      this.props.onHeroOccupation(hero, HeroOccupationType.HEALER);
    }

    return idleDamagedHeroes;
  }

  findVisitors(): Hero[] {
    this.checkIfHeroesNeedHealer();

    return this.props.heroes.filter(
      (h) => h.occupation === HeroOccupationType.HEALER
    );
  }

  render() {
    const { heroes, heroClicked, closeDisplay } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = this.findVisitors();

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

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService, auth } = customProps;

  return bindActionCreators(
    {
      heroClicked: heroStatsChoosed,
      onHeroOccupation: onHeroOccupation(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(HealerDisplayContainer);
