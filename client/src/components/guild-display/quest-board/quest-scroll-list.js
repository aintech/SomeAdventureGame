import React from "react";
import { connect } from "react-redux";
import QuestDetails from "./quest-details";
import QuestScrollItem from "./quest-scroll-item";
import {
  questScrollChoosed,
  questScrollClosed,
} from "../../../actions/actions.js";

const QuestScrollList = ({
  quests,
  questScrollChoosed,
  questScrollClosed,
  chosenQuest,
}) => {
  const acceptQuest = () => {
    console.log(chosenQuest);
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
      {quests.map((quest, idx) => {
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

const mapDispatchToProps = (dispatch) => ({
  questScrollChoosed: (payload) => {
    dispatch(questScrollChoosed(payload));
  },
  questScrollClosed: () => {
    dispatch(questScrollClosed());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QuestScrollList);
