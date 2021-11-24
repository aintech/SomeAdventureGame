import React, { Component, CSSProperties, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { questScrollClosed } from "../../../../actions/Actions";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Quest from "../../../../models/Quest";
import Loader from "../../../loader/Loader";
import "./guild-display.scss";
import HeroList from "./heroes/hero-list/HeroList";
import QuestScrollList from "./quest-board/quest-scroll-list/QuestScrollList";

type GuildDisplayProps = {
  quests: Quest[];
  heroes: Hero[];
  heroesAssignedToQuest: Hero[];
};

/**
 * TODO: Переключалка setShowUnabledHeroes сбрасывается если переоткрыть гильдию -
 * лучше сделать через редюсер чтобы запоминалась
 */
const GuildDisplay = ({ quests, heroes, heroesAssignedToQuest }: GuildDisplayProps) => {
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);
  const [heroesOnPage, setHeroesOnPage] = useState<Hero[]>([]);
  const [showUnabledHeroes, setShowUnabledHeroes] = useState<boolean>(false);

  useEffect(() => {
    const idleHeroes = heroes
      .filter((h) => showUnabledHeroes || (h.activity!.type === HeroActivityType.IDLE && h.isAlive()))
      .sort((a, b) => a.id - b.id);

    const lPage = Math.max(0, Math.ceil(idleHeroes.length / 4) - 1);

    if (page > lPage) {
      setPage(lPage);
    }

    const start = page * 4;
    const end = start + (page === 0 ? Math.min(4, idleHeroes.length) : lPage === page && idleHeroes.length % 4 !== 0 ? idleHeroes.length % 4 : 4);

    setLastPage(lPage);
    setHeroesOnPage(idleHeroes.slice(start, end));
  }, [page, heroes, heroesAssignedToQuest, showUnabledHeroes]);

  const switchPage = (add: number) => {
    const nPage = page + add;
    setPage(nPage);
  };

  const switchShowUnabled = () => {
    switchPage(-page);
    const show = !showUnabledHeroes;
    setShowUnabledHeroes(show);
  };

  const prevPageBtnStyle: CSSProperties = {
    opacity: page === 0 ? 0.5 : 1,
    cursor: page === 0 ? "default" : "pointer",
    pointerEvents: page === 0 ? "none" : "inherit",
  };

  const nextPageBtnStyle: CSSProperties = {
    opacity: page === lastPage ? 0.5 : 1,
    cursor: page === lastPage ? "default" : "pointer",
    pointerEvents: page === lastPage ? "none" : "inherit",
  };

  return (
    <div className="guild-display">
      <QuestScrollList quests={quests} />
      <div className="guild-display__hero-list">
        <HeroList heroes={heroesOnPage} quests={quests} heroesAssignedToQuest={heroesAssignedToQuest} />
        <div className="guild-display__btn-holder">
          <button className="btn--show-unabled" onClick={switchShowUnabled}>
            <i className="material-icons btn--show-unabled-icon">{!showUnabledHeroes ? "check_box" : "check_box_outline_blank"}</i>
            <span>Только свободные</span>
          </button>
          <button className="btn--previous" style={prevPageBtnStyle} onClick={() => switchPage(-1)}></button>
          <button
            className="btn--next"
            style={nextPageBtnStyle}
            onClick={() => {
              switchPage(1);
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};

type GuildDisplayContainerProps = {
  quests: Quest[];
  heroes: Hero[];
  heroesAssignedToQuest: Hero[];
  closeQuestScroll: () => void;
};

class GuildDisplayContainer extends Component<GuildDisplayContainerProps> {
  componentWillUnmount() {
    this.props.closeQuestScroll();
  }

  render() {
    const { quests, heroes, heroesAssignedToQuest } = this.props;

    if (!quests) {
      return <Loader message={"Fetching quests for guild..."} />;
    }

    return <GuildDisplay quests={quests} heroes={heroes} heroesAssignedToQuest={heroesAssignedToQuest} />;
  }
}

type GUildDisplayState = {
  quests: Quest[];
  heroes: Hero[];
  heroesAssignedToQuest: Hero[];
};

const mapStateToProps = ({ quests, heroes, heroesAssignedToQuest }: GUildDisplayState) => {
  return { quests, heroes, heroesAssignedToQuest };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({ closeQuestScroll: questScrollClosed }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GuildDisplayContainer);
