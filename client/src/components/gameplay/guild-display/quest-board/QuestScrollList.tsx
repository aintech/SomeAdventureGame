import React, { useContext } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import {
  questScrollChoosed,
  questScrollClosed,
} from "../../../../actions/Actions";
import { embarkHeroesOnQuest } from "../../../../actions/ApiActions";
import AuthContext, { AuthProps } from "../../../../contexts/AuthContext";
import withApiService, {
  WithApiServiceProps,
} from "../../../../hoc/WithApiService";
import Hero from "../../../../models/Hero";
import Quest from "../../../../models/Quest";
import QuestDetails from "./QuestDetails";
import QuestScrollItem from "./QuestScrollItem";
import "./quest-scroll-list.scss";

type QuestScrollListProps = {
  quests: Quest[];
  chosenQuest: Quest;
  questScrollChoosed: (quest: Quest) => void;
  questScrollClosed: () => void;
  embarkHeroesOnQuest: (
    auth: AuthProps,
    quest: Quest,
    heroesAssignedToQuest: Hero[]
  ) => void;
};

const QuestScrollList = ({
  quests,
  chosenQuest,
  questScrollChoosed,
  questScrollClosed,
  embarkHeroesOnQuest,
}: QuestScrollListProps) => {
  const authCtx = useContext(AuthContext);

  const acceptQuest = (quest: Quest, heroesAssignedToQuest: Hero[]) => {
    embarkHeroesOnQuest(authCtx, quest, heroesAssignedToQuest);
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
        <QuestDetails
          quest={chosenQuest}
          acceptQuest={acceptQuest}
          closeDetails={closeQuestScroll}
        />
      </div>
    );
  }

  const freshQuests = quests
    .filter((q) => !q.progress)
    .sort((a, b) => a.id - b.id);

  return (
    <div className="quest-scroll-list">
      {freshQuests
        .slice(0, Math.min(9, freshQuests.length))
        .map((quest, idx) => {
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

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
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
