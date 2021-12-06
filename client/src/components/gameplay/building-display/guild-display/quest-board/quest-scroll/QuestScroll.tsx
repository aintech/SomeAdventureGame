import React from "react";
import Quest from "../../../../../../models/Quest";
import "./quest-scroll.scss";

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

type QuestScrollProps = {
  quest: Quest;
  index: number;
};

/**
 * TODO: Уровень переместить налево, справа будет награда
 */

const QuestScroll = ({ quest, index }: QuestScrollProps) => {
  const { rotation } = getStoredRotation(index, quest.id);
  const style = { transform: `rotate(${rotation}deg)` };

  return (
    <div className="quest-scroll" style={style}>
      <span className="quest-scroll__title">{quest.title}</span>
      <span className="quest-scroll__level">{quest.level}</span>
    </div>
  );
};

export default QuestScroll;
