import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import {
  fetchHeroes,
  fetchQuests,
  questScrollClosed,
} from "../../actions/actions";
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

  // if (heroesAssignedToQuest) {
  //   idleHeroes = idleHeroes.filter(
  //     (h) => heroesAssignedToQuest.findIndex((f) => f.id === h.id) === -1
  //   );
  // }

  return (
    <div className="guild-display">
      <QuestScrollList quests={quests} />
      <HeroList
        heroes={idleHeroes}
        heroesAssignedToQuest={heroesAssignedToQuest}
      />
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
    const {
      quests,
      heroes,
      closeDisplay,
      closeQuestScroll,
      heroesAssignedToQuest,
    } = this.props;

    if (!quests) {
      return <div>LOADING...</div>;
    }

    const closeDisplayProcedure = () => {
      closeQuestScroll();
      closeDisplay();
    };

    return (
      <GuildDisplay
        closeDisplay={closeDisplayProcedure}
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

const mapDispatchToProps = (dispatch, customProps) => {
  const { apiService } = customProps;
  return bindActionCreators(
    {
      fetchQuests: fetchQuests(apiService),
      fetchHeroes: fetchHeroes(apiService),
      closeQuestScroll: questScrollClosed,
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(GuildDisplayContainer);
