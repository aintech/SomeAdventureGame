import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { embarkHeroesOnQuest } from "../../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../../hoc/WithApiService";
import Hero from "../../../../models/hero/Hero";
import { HeroActivityType } from "../../../../models/hero/HeroActivity";
import Quest from "../../../../models/Quest";
import { remove } from "../../../../utils/arrays";
import Loader from "../../../loader/Loader";
import "./guild-display.scss";
import GuildAssignee from "./quest-board/guild-assignee/GuildAssignee";
import QuestDetails from "./quest-board/quest-details/QuestDetails";
import QuestScroll from "./quest-board/quest-scroll/QuestScroll";

// TODO: Объявления "встряхиваются" при скролле

type GuildDisplayProps = {
  quests: Quest[];
  heroes: Hero[];
  embarkHeroesOnQuest: (quest: Quest, heroesAssignedToQuest: Hero[]) => void;
};

const GuildDisplay = ({ quests, heroes, embarkHeroesOnQuest }: GuildDisplayProps) => {
  const [assignedHeroes, setAssignedHeroes] = useState<Hero[]>([]);
  const [chosenQuest, setChosenQuest] = useState<Quest>();
  const [heroesOverlay, setHeroesOverlay] = useState(false);

  const assignHero = (hero: Hero) => {
    const assignees = assignedHeroes.length + 1;
    setAssignedHeroes([...assignedHeroes, hero]);

    if (assignees === 4) {
      setHeroesOverlay(false);
    }
  };

  const dismissHero = (hero: Hero) => {
    setAssignedHeroes(remove(assignedHeroes, hero));
  };

  const closeQuestScroll = () => {
    setAssignedHeroes([]);
    setChosenQuest(undefined);
    setHeroesOverlay(false);
  };

  const handleAccept = () => {
    if (heroesOverlay) {
      setHeroesOverlay(false);
    } else {
      if (assignedHeroes.length > 0) {
        embarkHeroesOnQuest(chosenQuest!, assignedHeroes);
        closeQuestScroll();
      }
    }
  };

  const handleCancel = () => {
    if (heroesOverlay) {
      setAssignedHeroes([]);
      setHeroesOverlay(false);
    } else {
      closeQuestScroll();
    }
  };

  if (chosenQuest) {
    let assignees = [];

    for (let i = 0; i < 4; i++) {
      if (assignedHeroes[i]) {
        assignees[i] = assignedHeroes[i];
      } else {
        assignees[i] = undefined;
      }
    }

    const acceptBtnClass = `guild-display__btn guild-display__btn-assign ${assignedHeroes.length === 0 ? "guild-display__btn_disabled" : ""}`;

    const controlsBlock = (
      <div className="guild-display__controls">
        <button className="guild-display__btn guild-display__btn-assign" onClick={handleCancel}>
          отмена
        </button>
        <button className={acceptBtnClass} onClick={handleAccept}>
          готово
        </button>
      </div>
    );

    if (heroesOverlay) {
      return (
        <>
          <div className="guild-display__heroes-list">
            {heroes
              .filter((hero) => hero.activity!.type === HeroActivityType.IDLE && hero.isAlive())
              .filter((hero) => !assignedHeroes.includes(hero))
              .map((hero) => (
                <GuildAssignee key={hero.id} hero={hero} assignHero={assignHero} />
              ))}
          </div>
          {controlsBlock}
        </>
      );
    }

    return (
      <>
        <QuestDetails quest={chosenQuest} />
        {chosenQuest ? (
          <>
            <div className="guild-display__assignees">
              {assignees.map((hero, idx) => {
                if (hero) {
                  return (
                    <div key={idx} className="guild-display__assignees_hero">
                      {hero.name}
                      <button className="guild-display__assignees_dismiss" onClick={() => dismissHero(hero)}>
                        X
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="guild-display__btn  guild-display__btn-assignee" onClick={() => setHeroesOverlay(true)}>
                    +
                  </div>
                );
              })}
            </div>
            {controlsBlock}
          </>
        ) : null}
      </>
    );
  }

  const freshQuests = quests.filter((q) => !q.progress).sort((a, b) => a.id - b.id);

  return (
    <div className="guild-display">
      <div className="guild-display__quest-list">
        {freshQuests.slice(0, Math.min(20, freshQuests.length)).map((quest, idx) => {
          return (
            <div key={quest.id} onClick={() => setChosenQuest(quest)}>
              <QuestScroll quest={quest} index={idx} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

type GuildDisplayContainerProps = {
  quests: Quest[];
  heroes: Hero[];
  embarkHeroesOnQuest: (quest: Quest, heroesAssignedToQuest: Hero[]) => void;
};

class GuildDisplayContainer extends Component<GuildDisplayContainerProps> {
  render() {
    const { quests, heroes, embarkHeroesOnQuest } = this.props;

    if (!quests) {
      return <Loader message={"Fetching quests for guild..."} />;
    }

    if (!heroes) {
      return <Loader message={"Fetching mercenaries..."} />;
    }

    return <GuildDisplay quests={quests} heroes={heroes} embarkHeroesOnQuest={embarkHeroesOnQuest} />;
  }
}

type GUildDisplayState = {
  quests: Quest[];
  heroes: Hero[];
};

const mapStateToProps = ({ quests, heroes }: GUildDisplayState) => {
  return { quests, heroes };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      embarkHeroesOnQuest: embarkHeroesOnQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(GuildDisplayContainer);
