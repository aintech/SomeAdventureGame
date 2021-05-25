import React from "react";
import Hero from "../../../models/Hero";
import Quest from "../../../models/Quest";
import QuestProgressItem from "../quest-progress-item/quest-progress-item";
import "./quest-progress-list.scss";

type QuestProgressListProps = {
  quests: Quest[];
  heroes: Hero[];
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
          <div key={quest.id}>
            <QuestProgressItem quest={quest} heroes={heroes} />
          </div>
        );
      })}
    </div>
  );
};

export default QuestProgressList;
