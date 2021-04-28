import React from "react";
import QuestProgressItem from "../quest-progress-item/quest-progress-item.js";
import "./quest-progress-list.scss";

const QuestProgressList = ({ quests, heroes }) => {
  if (!quests || !heroes) {
    return null;
  }

  const embarked = [];
  for (let i = 0; i < quests.length; i++) {
    const q = quests[i];
    if (q.embarkedTime) {
      embarked.push({
        key: q,
        value: heroes.filter((h) => h.embarkedQuest === q.id),
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
