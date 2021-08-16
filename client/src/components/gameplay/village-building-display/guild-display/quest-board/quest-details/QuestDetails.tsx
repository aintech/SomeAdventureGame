import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { heroDismissedFromQuest } from "../../../../../../actions/Actions";
import { useDisplayMessage } from "../../../../../../hooks/UseDisplayMessages";
import Hero from "../../../../../../models/hero/Hero";
import { HeroType } from "../../../../../../models/hero/HeroType";
import Quest from "../../../../../../models/Quest";
import { convertDuration } from "../../../../../../utils/Utils";
import { GUILD_SHARE, MAX_EMBARKED_QUESTS } from "../../../../../../utils/variables";
import "./quest-details.scss";

type QuestDetailsProps = {
  quest: Quest;
  heroesAssignedToQuest: Hero[];
  quests: Quest[];
  heroDismissedFromQuest: (hero: Hero) => void;
  acceptQuest: (quest: Quest, assignedHeroes: Hero[]) => void;
  closeDetails: () => void;
};

const QuestDetails = ({
  quest,
  heroesAssignedToQuest,
  quests,
  acceptQuest,
  heroDismissedFromQuest,
  closeDetails,
}: QuestDetailsProps) => {
  const displayMessage = useDisplayMessage();

  const dismissHero = (hero: Hero) => {
    heroDismissedFromQuest(hero);
  };

  const onAcceptQuest = () => {
    acceptQuest(quest, heroesAssignedToQuest);
    displayMessage(`Герои отправились на задание "${quest.title}"`);
  };

  const questsInProgress = quests.filter((q) => q.progress !== undefined).length;

  const canAcceptQuest = heroesAssignedToQuest.length > 0 && questsInProgress < MAX_EMBARKED_QUESTS;

  const acceptBtnStyle = canAcceptQuest
    ? {
        opacity: 1,
        cursor: "pointer",
      }
    : {
        opacity: 0.5,
        cursor: "default",
      };

  const assignedRender = heroesAssignedToQuest.map((hero) => {
    const shortName = hero.name.length > 10 ? `${hero.name.substring(0, 7)}...` : hero.name;

    return (
      <div className="quest-details__assigned-heroes__hero" key={hero.id}>
        <div className={`quest-details__assigned-heroes__hero--${HeroType[hero.type].toLocaleLowerCase()}`}></div>
        <div className="quest-details__assigned-heroes__hero-name">{shortName}</div>
        <button
          onClick={() => {
            dismissHero(hero);
          }}
          className="quest-details__assigned-heroes__hero-dismiss"
        ></button>
      </div>
    );
  });

  return (
    <div className="quest-details">
      <button className="quest-details__btn--close" onClick={closeDetails}></button>
      <div className="quest-details__title">{quest.title}</div>
      <div className="quest-details__level">Ур. {quest.level}</div>
      <div className="quest-details__description">
        {quest.description.replace(":tribute", quest.tribute.toString())}
      </div>
      <div className="quest-details__duration">{convertDuration(quest.duration)}</div>
      <div className="quest-details__tribute">
        Доля гильдии {Math.floor(quest.tribute * GUILD_SHARE)} монет ({GUILD_SHARE * 100}%)
      </div>
      <div className="quest-details__experience">Опыт героям {quest.experience} очков</div>
      <div className="quest-details__assigned-heroes">{assignedRender}</div>
      {questsInProgress < MAX_EMBARKED_QUESTS ? (
        <button
          className="quest-details__btn--accept"
          onClick={onAcceptQuest}
          style={acceptBtnStyle}
          disabled={!canAcceptQuest}
        ></button>
      ) : (
        <div className="quest-details__max-quest-msg">Выполняется максимальное количество квестов</div>
      )}
    </div>
  );
};

type QuestDetailsState = {
  heroesAssignedToQuest: Hero[];
  quests: Quest[];
};

const mapStateToProps = ({ heroesAssignedToQuest, quests }: QuestDetailsState) => {
  return { heroesAssignedToQuest, quests };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  heroDismissedFromQuest: (hero: Hero) => {
    dispatch(heroDismissedFromQuest(hero));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestDetails);
