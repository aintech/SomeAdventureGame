import React from "react";
import { connect } from "react-redux";
import QuestDetails from "./quest-details";
import QuestScrollItem from "./quest-scroll-item";
import {
  questScrollChoosed,
  questScrollClosed,
  embarkHeroesOnQuest,
} from "../../../actions/actions.js";
import "./quest-scroll-list.scss";
import { bindActionCreators, compose } from "redux";
import withApiService from "../../../hoc/with-api-service.js";

const QuestScrollList = ({
  quests,
  chosenQuest,
  questScrollChoosed,
  questScrollClosed,
  embarkHeroesOnQuest,
}) => {
  const acceptQuest = (quest, heroesAssignedToQuest) => {
    embarkHeroesOnQuest({ quest, heroesAssignedToQuest });
  };

  const chooseQuest = (quest) => {
    questScrollChoosed(quest);
  };

  const closeQuestScroll = () => {
    questScrollClosed();
  };

  if (chosenQuest) {
    return (
      <div>
        <QuestDetails
          quest={chosenQuest}
          acceptQuest={acceptQuest}
          closeDetails={closeQuestScroll}
        />
      </div>
    );
  }

  return (
    <div className="quest-scroll-list">
      {quests
        .filter((q) => q.embarkedTime === null)
        .map((quest, idx) => {
          return (
            <div key={quest.id}>
              <QuestScrollItem
                quest={quest}
                index={idx}
                onClickQuestScroll={() => chooseQuest(quest)}
              />
            </div>
          );
        })}
    </div>
  );
};

const mapStateToProps = ({ chosenQuest }) => {
  return { chosenQuest };
};

const mapDispatchToProps = (dispatch, customProps) => {
  const { apiService } = customProps;
  return bindActionCreators(
    {
      questScrollChoosed,
      questScrollClosed,
      embarkHeroesOnQuest: embarkHeroesOnQuest(apiService),
    },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(QuestScrollList);
