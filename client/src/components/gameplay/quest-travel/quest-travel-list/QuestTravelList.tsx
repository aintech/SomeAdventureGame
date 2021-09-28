import React from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/hero/Hero";
import Quest from "../../../../models/Quest";
import QuestTravelItem from "../quest-travel-item/QuestTravelItem";
import "./quest-travel-list.scss";

type QuestTravelListProps = {
  quests?: Quest[];
  heroes?: Hero[];
};

const QuestTravelList = ({ quests, heroes }: QuestTravelListProps) => {
  if (!quests || quests.length === 0 || !heroes || heroes.length === 0) {
    return null;
  }

  const embarked = [];
  for (const quest of quests) {
    if (quest.progress?.embarkedTime) {
      embarked.push({
        key: quest,
        value: heroes.filter((h) => h.activity?.activityId === quest.id),
      });
    }
  }

  return (
    <div className="quest-travel-list">
      {embarked.map((eq) => {
        const { key: quest, value: heroes } = eq;
        return <QuestTravelItem key={quest.id} quest={quest} heroes={heroes} />;
      })}
    </div>
  );
};

type QuestTravelListState = {
  quests: Quest[];
  heroes: Hero[];
};

const mapStateToProps = ({ quests, heroes }: QuestTravelListState) => {
  return { quests, heroes };
};

export default connect(mapStateToProps, null)(QuestTravelList);
