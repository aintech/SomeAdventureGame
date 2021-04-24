import React from "react";
import { connect } from "react-redux";
import { heroDismissedFromQuest } from "../../../actions/actions.js";
import { convertDuration } from "../../../utils/utils.js";
import "./quest-details.scss";

const QuestDetails = ({
  quest,
  heroesAssignedToQuest,
  acceptQuest,
  heroDismissedFromQuest,
  closeDetails,
}) => {
  const dismissHero = (hero) => {
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
              className={`quest-details__assigned-heroes__hero--${hero.class}`}
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
        {quest.description.replace(":tribute", quest.tribute)}
      </div>
      <div className="quest-details__duration">
        {convertDuration(quest.duration)}
      </div>
      <div className="quest-details__tribute">
        Доля гильдии {Math.floor(quest.tribute * 0.5)} монет (50%)
      </div>
      <div className="quest-details__experience">
        Опыт героям {quest.experience} очков
      </div>
      <div className="quest-details__assigned-heroes">{assignedRender}</div>
      <button
        className="quest-details__btn--accept"
        onClick={onAcceptQuest}
        style={acceptBtnStyle}
      ></button>
    </div>
  );
};

const mapStateToProps = ({ heroesAssignedToQuest }) => {
  return { heroesAssignedToQuest };
};

const mapDispatchToProps = (dispatch) => ({
  heroDismissedFromQuest: (hero) => {
    dispatch(heroDismissedFromQuest(hero));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestDetails);
