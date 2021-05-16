import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { questScrollClosed } from "../../actions/actions";
import Loader from "../loader/loader";
import "./guild-display.scss";
import HeroList from "./heros/hero-list";
import QuestScrollList from "./quest-board/quest-scroll-list";

/**
 * TODO: Переключалка setShowUnabledHeroes сбрасывается если переоткрыть гильдию -
 * лучше сделать через редюсер чтобы запоминалась
 */
const GuildDisplay = ({
  quests,
  heroes,
  heroesAssignedToQuest,
  closeDisplay,
}) => {
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [heroesOnPage, setHeroesOnPage] = useState([]);
  const [showUnabledHeroes, setShowUnabledHeroes] = useState(false);

  useEffect(() => {
    const idleHeroes = heroes
      .filter((h) => showUnabledHeroes || h.embarkedQuest === null)
      .sort((a, b) => a.id - b.id);

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
  }, [page, heroes, heroesAssignedToQuest, showUnabledHeroes]);

  const switchPage = (add) => {
    const nPage = page + add;
    setPage(nPage);
  };

  const switchShowUnabled = () => {
    switchPage(-page);
    const show = !showUnabledHeroes;
    setShowUnabledHeroes(show);
  };

  const clickHandler = (event) => {
    if (event.target.id === "guild-display") {
      closeDisplay();
    }
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
    <div className="guild-display" id="guild-display" onClick={clickHandler}>
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
        className="guild-display__btn--show-unabled"
        onClick={switchShowUnabled}
      >
        <i className="material-icons guild-display__btn--show-unabled-icon">
          {!showUnabledHeroes ? "check_box" : "check_box_outline_blank"}
        </i>
        <span>Only idle heroes</span>
      </button>
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
  render() {
    const {
      quests,
      heroes,
      closeDisplay,
      closeQuestScroll,
      heroesAssignedToQuest,
    } = this.props;

    if (!quests) {
      return <Loader message={"Fetching quests for guild..."} />;
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ closeQuestScroll: questScrollClosed }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuildDisplayContainer);
