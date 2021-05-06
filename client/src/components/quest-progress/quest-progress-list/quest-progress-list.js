import React from "react";
import QuestProgressItem from "../quest-progress-item/quest-progress-item.js";
import "./quest-progress-list.scss";

const QuestProgressList = ({ quests, heroes }) => {
  if (!quests || !heroes) {
    return null;
  }

  const embarked = [];
  for (const quest of quests) {
    if (quest.embarkedTime) {
      embarked.push({
        key: quest,
        value: heroes.filter((h) => h.embarkedQuest === quest.id),
      });
    }
  }

  return (
    <div className="quest-progress-list">
      {embarked.map((eq) => {
        const { key: quest, value: hers } = eq;
        return (
          <div key={quest.id}>
            <QuestProgressItem quest={quest} heroes={hers} />
          </div>
        );
      })}
    </div>
  );
};

export default QuestProgressList;
