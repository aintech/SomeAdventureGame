import React from "react";
import Quest from "../../../../../models/Quest";
import "./quest-scroll-item.scss";

const random = (range: number) => {
  return Math.random() * range * (Math.random() > 0.5 ? -1 : 1);
};

const storeRotation = (index: number, questId: number, rotation: number) => {
  sessionStorage.setItem(`some-adventure-game--quest-scroll-${index}`, JSON.stringify({ questId, rotation }));
};

const getStoredRotation = (index: number, questId: number) => {
  const storedRotation = sessionStorage.getItem(`some-adventure-game--quest-scroll-${index}`);
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

type QuestScrollItemProps = {
  quest: Quest;
  index: number;
};

/**
 * TODO: Уровень переместить налево, справа будет награда
 */

const QuestScrollItem = ({ quest, index }: QuestScrollItemProps) => {
  const { rotation } = getStoredRotation(index, quest.id);
  const style = { transform: `rotate(${rotation}deg)` };

  return (
    <div className="quest-scroll-item" style={style}>
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
