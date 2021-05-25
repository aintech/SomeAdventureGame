import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { heroDismissedFromQuest } from "../../../actions/Actions";
import Hero, { HeroType } from "../../../models/Hero";
import Quest from "../../../models/Quest";
import { convertDuration } from "../../../utils/Utils";
import { GUILD_SHARE } from "../../../utils/Variables";
import "./quest-details.scss";

type QuestDetailsProps = {
  quest: Quest;
  heroesAssignedToQuest: Hero[];
  heroDismissedFromQuest: (hero: Hero) => void;
  acceptQuest: (quest: Quest, assignedHeroes: Hero[]) => void;
  closeDetails: () => void;
};

const QuestDetails = ({
  quest,
  heroesAssignedToQuest,
  acceptQuest,
  heroDismissedFromQuest,
  closeDetails,
}: QuestDetailsProps) => {
  const dismissHero = (hero: Hero) => {
    heroDismissedFromQuest(hero);
  };

  const onAcceptQuest = () => {
    acceptQuest(quest, heroesAssignedToQuest);
  };

  const acceptBtnStyle =
    heroesAssignedToQuest?.length === 0
      ? {
          opacity: 0.5,
          cursor: "default",
        }
      : {
          opacity: 1,
          cursor: "pointer",
        };

  const assignedRender =
    heroesAssignedToQuest?.length > 0 ? (
      heroesAssignedToQuest.map((hero) => {
        const shortName =
          hero.name.length > 10 ? `${hero.name.substring(0, 7)}...` : hero.name;

        return (
          <div className="quest-details__assigned-heroes__hero" key={hero.id}>
            <div
              className={`quest-details__assigned-heroes__hero--${
                HeroType[hero.type]
              }`}
            ></div>
            <div className="quest-details__assigned-heroes__hero-name">
              {shortName}
            </div>
            <button
              onClick={() => {
                dismissHero(hero);
              }}
              className="quest-details__assigned-heroes__hero-dismiss"
            ></button>
          </div>
        );
      })
    ) : (
      <div></div>
    );

  return (
    <div className="quest-details">
      <button
        className="quest-details__btn--close"
        onClick={closeDetails}
      ></button>
      <div className="quest-details__title">{quest.title}</div>
      <div className="quest-details__level">Ур. {quest.level}</div>
      <div className="quest-details__description">
        {quest.description.replace(":tribute", quest.tribute.toString())}
      </div>
      <div className="quest-details__duration">
        {convertDuration(quest.duration)}
      </div>
      <div className="quest-details__tribute">
        Доля гильдии {Math.floor(quest.tribute * GUILD_SHARE)} монет (
        {GUILD_SHARE * 100}%)
      </div>
      <div className="quest-details__experience">
        Опыт героям {quest.experience} очков
      </div>
      <div className="quest-details__assigned-heroes">{assignedRender}</div>
      <button
        className="quest-details__btn--accept"
        onClick={onAcceptQuest}
        style={acceptBtnStyle}
        disabled={heroesAssignedToQuest.length === 0}
      ></button>
    </div>
  );
};

type state = {
  heroesAssignedToQuest: Hero[];
};

const mapStateToProps = ({ heroesAssignedToQuest }: state) => {
  return { heroesAssignedToQuest };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  heroDismissedFromQuest: (hero: Hero) => {
    dispatch(heroDismissedFromQuest(hero));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestDetails);
