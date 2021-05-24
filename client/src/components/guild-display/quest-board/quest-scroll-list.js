import React, { useContext } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import {
  embarkHeroesOnQuest,
  questScrollChoosed,
  questScrollClosed,
} from "../../../actions/actions.js";
import AuthContext from "../../../contexts/auth-context";
import withApiService from "../../../hoc/with-api-service";
import QuestDetails from "./quest-details";
import QuestScrollItem from "./quest-scroll-item";
import "./quest-scroll-list.scss";

const QuestScrollList = ({
  quests,
  chosenQuest,
  questScrollChoosed,
  questScrollClosed,
  embarkHeroesOnQuest,
}) => {
  const auth = useContext(AuthContext);

  const acceptQuest = (quest, heroesAssignedToQuest) => {
    embarkHeroesOnQuest(auth, quest, heroesAssignedToQuest);
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

  const freshQuests = quests
    .filter((q) => q.embarkedTime === null)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="quest-scroll-list">
      {freshQuests
        .slice(0, Math.min(9, freshQuests.length))
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
