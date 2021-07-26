import React, { Component, CSSProperties, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { questScrollClosed } from "../../../actions/Actions";
import Hero from "../../../models/hero/Hero";
import { HeroActivityType } from "../../../models/hero/HeroActivityType";
import Quest from "../../../models/Quest";
import Loader from "../../loader/Loader";
import "./guild-display.scss";
import HeroList from "./heroes/HeroList";
import QuestScrollList from "./quest-board/QuestScrollList";

type GuildDisplayProps = {
  quests: Quest[];
  heroes: Hero[];
  heroesAssignedToQuest: Hero[];
  closeDisplay: () => void;
};

/**
 * TODO: Переключалка setShowUnabledHeroes сбрасывается если переоткрыть гильдию -
 * лучше сделать через редюсер чтобы запоминалась
 */
const GuildDisplay = ({ quests, heroes, heroesAssignedToQuest, closeDisplay }: GuildDisplayProps) => {
  const [page, setPage] = useState<number>(0);
  const [lastPage, setLastPage] = useState<number>(0);
  const [heroesOnPage, setHeroesOnPage] = useState<Hero[]>([]);
  const [showUnabledHeroes, setShowUnabledHeroes] = useState<boolean>(false);

  useEffect(() => {
    const idleHeroes = heroes
      .filter((h) => showUnabledHeroes || (h.activity!.type === HeroActivityType.IDLE && h.isAilve()))
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
        : lPage === page && idleHeroes.length % 4 !== 0
        ? idleHeroes.length % 4
        : 4);

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

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLDivElement).id === "guild-display") {
      closeDisplay();
    }
  };

  const prevStyle: CSSProperties = {
    opacity: page === 0 ? 0.5 : 1,
    cursor: page === 0 ? "default" : "pointer",
    pointerEvents: page === 0 ? "none" : "inherit",
  };

  const nextStyle: CSSProperties = {
    opacity: page === lastPage ? 0.5 : 1,
    cursor: page === lastPage ? "default" : "pointer",
    pointerEvents: page === lastPage ? "none" : "inherit",
  };

  return (
    <div className="guild-display" id="guild-display" onClick={clickHandler}>
      <QuestScrollList quests={quests} />
      <HeroList heroes={heroesOnPage} heroesAssignedToQuest={heroesAssignedToQuest} />
      <button className="guild-display__btn--close" onClick={closeDisplay}></button>
      <button className="guild-display__btn--show-unabled" onClick={switchShowUnabled}>
        <i className="material-icons guild-display__btn--show-unabled-icon">
          {!showUnabledHeroes ? "check_box" : "check_box_outline_blank"}
        </i>
        <span>Только доступные</span>
      </button>
      <button className="guild-display__btn--previous" style={prevStyle} onClick={() => switchPage(-1)}></button>
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

type GuildDisplayContainerProps = {
  quests: Quest[];
  heroes: Hero[];
  heroesAssignedToQuest: Hero[];
  closeDisplay: () => void;
  closeQuestScroll: () => void;
};

class GuildDisplayContainer extends Component<GuildDisplayContainerProps> {
  render() {
    const { quests, heroes, heroesAssignedToQuest, closeDisplay, closeQuestScroll } = this.props;

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
