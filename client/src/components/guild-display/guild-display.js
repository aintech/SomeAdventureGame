import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { fetchHeroes, fetchQuests } from "../../actions/actions";
import withApiService from "../../hoc/with-api-service";
import "./guild-display.scss";
import HeroList from "./heros/hero-list";
import QuestScrollList from "./quest-board/quest-scroll-list";

const GuildDisplay = ({
  quests,
  heroes,
  heroesAssignedToQuest,
  closeDisplay,
}) => {
  let idleHeroes = heroes.filter((h) => h.embarkedOnQuest === null);

  if (heroesAssignedToQuest) {
    idleHeroes = idleHeroes.filter(
      (h) => heroesAssignedToQuest.findIndex((f) => f.id === h.id) === -1
    );
  }

  return (
    <div className="guild-display">
      <QuestScrollList quests={quests} />
      <HeroList heroes={idleHeroes} />
      <button
        className="guild-display__btn--close"
        onClick={closeDisplay}
      ></button>
    </div>
  );
};

class GuildDisplayContainer extends Component {
  componentDidMount() {
    this.props.fetchQuests();
    this.props.fetchHeroes();
  }

  render() {
    const { quests, heroes, closeDisplay, heroesAssignedToQuest } = this.props;

    if (!quests) {
      return <div>LOADING...</div>;
    }

    return (
      <GuildDisplay
        closeDisplay={closeDisplay}
        quests={quests}
        heroes={heroes}
        heroesAssignedToQuest={heroesAssignedToQuest}
      />
    );
  }
}

const mapStateToProps = ({ quests, heroes, heroesAssignedToQuest }) => {
  return { quests, heroes, heroesAssignedToQuest };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { apiService } = ownProps;
  return bindActionCreators(
    {
      fetchQuests: fetchQuests(apiService),
      fetchHeroes: fetchHeroes(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GuildDisplayContainer);
