import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { questScrollChoosed, questScrollClosed } from "../../../../../../actions/Actions";
import { embarkHeroesOnQuest } from "../../../../../../actions/ApiActions";
import withApiService, { WithApiServiceProps } from "../../../../../../hoc/WithApiService";
import Hero from "../../../../../../models/hero/Hero";
import Quest from "../../../../../../models/Quest";
import "./quest-scroll-list.scss";
import QuestDetails from "../quest-details/QuestDetails";
import QuestScrollItem from "../quest-scroll-item/QuestScrollItem";

type QuestScrollListProps = {
  quests: Quest[];
  chosenQuest: Quest;
  questScrollChoosed: (quest: Quest) => void;
  questScrollClosed: () => void;
  embarkHeroesOnQuest: (quest: Quest, heroesAssignedToQuest: Hero[]) => void;
};

const QuestScrollList = ({
  quests,
  chosenQuest,
  questScrollChoosed,
  questScrollClosed,
  embarkHeroesOnQuest,
}: QuestScrollListProps) => {
  const acceptQuest = (quest: Quest, heroesAssignedToQuest: Hero[]) => {
    embarkHeroesOnQuest(quest, heroesAssignedToQuest);
  };

  const chooseQuest = (quest: Quest) => {
    questScrollChoosed(quest);
  };

  const closeQuestScroll = () => {
    questScrollClosed();
  };

  if (chosenQuest) {
    return (
      <div>
        <QuestDetails quest={chosenQuest} acceptQuest={acceptQuest} closeDetails={closeQuestScroll} />
      </div>
    );
  }

  const freshQuests = quests.filter((q) => !q.progress).sort((a, b) => a.id - b.id);

  return (
    <div className="quest-scroll-list">
      {freshQuests.slice(0, Math.min(9, freshQuests.length)).map((quest, idx) => {
        return (
          <div key={quest.id} onClick={() => chooseQuest(quest)}>
            <QuestScrollItem quest={quest} index={idx} />
          </div>
        );
      })}
    </div>
  );
};

type QuestScrollListState = {
  chosenQuest: Quest;
};

const mapStateToProps = ({ chosenQuest }: QuestScrollListState) => {
  return { chosenQuest };
};

const mapDispatchToProps = (dispatch: Dispatch, customProps: WithApiServiceProps) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    {
      questScrollChoosed,
      questScrollClosed,
      embarkHeroesOnQuest: embarkHeroesOnQuest(apiService, auth),
    },
    dispatch
  );
};

export default compose(withApiService(), connect(mapStateToProps, mapDispatchToProps))(QuestScrollList);
