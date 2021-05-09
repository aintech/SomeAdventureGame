import React from "react";
import "./quest-scroll-item.scss";

const random = (range) => {
  return Math.random() * range * (Math.random() > 0.5 ? -1 : 1);
};

const storeRotation = (index, questId, rotation) => {
  sessionStorage.setItem(
    `some-adventure-game--quest-scroll-${index}`,
    JSON.stringify({ questId, rotation })
  );
};

const getStoredRotation = (index, questId) => {
  const storedRotation = sessionStorage.getItem(
    `some-adventure-game--quest-scroll-${index}`
  );
  let rotation = 0;

  if (storedRotation) {
    const parsed = JSON.parse(storedRotation);
    if (parsed.questId !== questId) {
      storeRotation(index, questId, rotation);
    } else {
      rotation = parsed.rotation;
    }
  } else {
    rotation = random(15);
    storeRotation(index, questId, rotation);
  }

  return { rotation };
};

const QuestScrollItem = ({ quest, index, onClickQuestScroll }) => {
  const { rotation } = getStoredRotation(index, quest.id);
  const style = { transform: `rotate(${rotation}deg)` };

  return (
    <div
      className="quest-scroll-item"
      style={style}
      onClick={onClickQuestScroll}
    >
      <span className="quest-scroll-item__title">{quest.title}</span>
      <span className="quest-scroll-item__level">{quest.level}</span>
      {/*
        <span className="quest-scroll-item__duration">
        {convertDuration(quest.duration)}
        </span>
        <span className="quest-scroll-item__tribute">{quest.tribute}</span>
        <span className="quest-scroll-item__experience">{quest.experience}</span>
        */}
    </div>
  );
};

export default QuestScrollItem;