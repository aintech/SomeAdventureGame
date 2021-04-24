import React, { Component, useEffect, useState } from "react";
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
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [heroesOnPage, setHeroesOnPage] = useState([]);

  useEffect(() => {
    const idleHeroes = heroes.filter((h) => h.embarkedQuest === null);

    const lPage = Math.max(0, Math.ceil(idleHeroes.length / 4) - 1);

    if (page > lPage) {
      setPage(lPage);
    }

    const start = page * 4;
    const end =
      start +
      (page === 0
        ? Math.min(4, idleHeroes.length)
        : lPage === page
        ? idleHeroes.length % 4
        : 4);

    setLastPage(lPage);
    setHeroesOnPage(idleHeroes.slice(start, end));
  }, [page, heroes, heroesAssignedToQuest]);

  const switchPage = (add) => {
    const nPage = page + add;
    setPage(nPage);
  };

  const prevStyle = {
    opacity: page === 0 ? 0.5 : 1,
    cursor: page === 0 ? "default" : "pointer",
    pointerEvents: page === 0 ? "none" : "inherit",
  };

  const nextStyle = {
    opacity: page === lastPage ? 0.5 : 1,
    cursor: page === lastPage ? "default" : "pointer",
    pointerEvents: page === lastPage ? "none" : "inherit",
  };

  return (
    <div className="guild-display">
      <QuestScrollList quests={quests} />
      <HeroList
        heroes={heroesOnPage}
        heroesAssignedToQuest={heroesAssignedToQuest}
      />
      <button
        className="guild-display__btn--close"
        onClick={closeDisplay}
      ></button>
      <button
        className="guild-display__btn--previous"
        style={prevStyle}
        onClick={() => switchPage(-1)}
      ></button>
      <button
        className="guild-display__btn--next"
        style={nextStyle}
        onClick={() => {
          switchPage(1);
        }}
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
