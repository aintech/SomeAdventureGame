import React from "react";
import { connect } from "react-redux";
import Hero from "../../../../models/Hero";
import Quest from "../../../../models/Quest";
import QuestProgressItem from "../quest-progress-item/QuestProgressItem";
import "./quest-progress-list.scss";

type QuestProgressListProps = {
  quests?: Quest[];
  heroes?: Hero[];
};

const QuestProgressList = ({ quests, heroes }: QuestProgressListProps) => {
  if (!quests || !heroes) {
    return null;
  }

  const embarked = [];
  for (const quest of quests) {
    if (quest.progress?.embarkedTime) {
      embarked.push({
        key: quest,
        value: heroes.filter((h) => h.embarkedQuest === quest.id),
      });
    }
  }

  return (
    <div className="quest-progress-list">
      {embarked.map((eq) => {
        const { key: quest, value: heroes } = eq;
        return (
          <QuestProgressItem key={quest.id} quest={quest} heroes={heroes} />
        );
      })}
    </div>
  );
};

type QuestProgressListState = {
  quests: Quest[];
  heroes: Hero[];
};

const mapStateToProps = ({ quests, heroes }: QuestProgressListState) => {
  return { quests, heroes };
};

export default connect(mapStateToProps, null)(QuestProgressList);
