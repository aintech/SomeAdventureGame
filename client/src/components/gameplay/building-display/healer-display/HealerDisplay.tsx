import React, { Component } from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Loader from "../../../loader/Loader";
import HeroContainer from "../../../shared/hero-container/HeroContainer";
import "./healer-display.scss";

type HealerDisplayProps = {
  visitors: Hero[];
};

const HealerDisplay = ({ visitors }: HealerDisplayProps) => {
  return (
    <div className="healer-display">
      {visitors.map((visitor) => (
        <HeroContainer key={visitor.id} hero={visitor} />
      ))}
    </div>
  );
};

type HealerDisplayContainerProps = {
  heroes: Hero[];
};

class HealerDisplayContainer extends Component<HealerDisplayContainerProps> {
  render() {
    const { heroes } = this.props;

    if (!heroes) {
      return <Loader message={`Wating for heroes`} />;
    }

    const visitors = heroes.filter((h) => h.activity!.type === HeroActivityType.HEALING);

    return <HealerDisplay visitors={visitors} />;
  }
}

type HealerDisplayContainerState = {
  heroes: Hero[];
};

const mapStateToProps = ({ heroes }: HealerDisplayContainerState) => {
  return { heroes };
};

export default connect(mapStateToProps)(HealerDisplayContainer);
