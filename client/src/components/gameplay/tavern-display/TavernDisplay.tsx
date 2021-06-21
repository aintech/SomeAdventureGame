import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { onHireHero } from "../../../actions/ApiActions";
import withApiService, {
  WithApiServiceProps,
} from "../../../hoc/WithApiService";
import Hero from "../../../models/hero/Hero";
import "./tavern-display.scss";
import TavernPatron from "./tavern-patron/TavernPatron";

type TavernDisplayProps = {
  patrons: Hero[];
  closeDisplay: () => void;
  hirePatron: (patron: Hero) => void;
};

const TavernDisplay = ({
  patrons,
  closeDisplay,
  hirePatron,
}: TavernDisplayProps) => {
  return (
    <div className="tavern-display" onClick={closeDisplay}>
      <button
        className="tavern-display__btn--close"
        onClick={closeDisplay}
      ></button>
      <div className="tavern-display__container">
        <div className="tavern-display__name">Таверна "Дикий вепрь"</div>
        <div className="tavern-display__patrons-holder">
          {patrons.map((p) => (
            <TavernPatron key={p.id} patron={p} hirePatron={hirePatron} />
          ))}
        </div>
      </div>
    </div>
  );
};

type TavernDisplayContainerProps = {
  tavernPatrons: Hero[];
  closeDisplay: () => void;
  hirePatron: (patron: Hero) => void;
};

class TavernDisplayContainer extends Component<TavernDisplayContainerProps> {
  onHirePatron(hero: Hero) {
    this.props.hirePatron(hero);
  }

  render() {
    const { tavernPatrons, closeDisplay } = this.props;

    return (
      <TavernDisplay
        patrons={tavernPatrons}
        closeDisplay={closeDisplay}
        hirePatron={this.onHirePatron.bind(this)}
      />
    );
  }
}

type TavernDisplayContainerState = {
  tavernPatrons: Hero[];
};

const mapStateToProps = ({ tavernPatrons }: TavernDisplayContainerState) => {
  return { tavernPatrons };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      hirePatron: onHireHero(apiService, auth),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(TavernDisplayContainer);
