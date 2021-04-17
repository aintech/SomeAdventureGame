import React from "react";
import { convertDuration } from "../../../utils/utils.js";
import "./quest-scroll-item.scss";

const random = (range) => {
  return Math.random() * range * (Math.random() > 0.5 ? -1 : 1);
};

const storePose = (index, questId, x, y, rotation) => {
  sessionStorage.setItem(
    `some-adventure-game--quest-pose-${index}`,
    JSON.stringify({
      questId: questId,
      x,
      y,
      rotation,
    })
  );
};

const getStoredPose = (index, questId) => {
  const storedPose = sessionStorage.getItem(
    `some-adventure-game--quest-pose-${index}`
  );

  let x = 0;
  let y = 0;
  let rotation = 0;

  if (storedPose) {
    const parsed = JSON.parse(storedPose);
    if (Number.parseInt(parsed.questId) !== questId) {
      storePose(index, questId, x, y, rotation);
    } else {
      x = parsed.x;
      y = parsed.y;
      rotation = parsed.rotation;
    }
  } else {
    x = 120 + (index % 3) * 160 + random(14);
    y = 200 + Math.floor(index / 3) * 130 + random(8);
    rotation = random(15);
    storePose(index, questId, x, y, rotation);
  }

  return { x, y, rotation };
};

const QuestScrollItem = ({ quest, index, onClickQuestScroll }) => {
  const { x, y, rotation } = getStoredPose(index, quest.id);

  const posStyle = {
    left: x,
    top: y,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div
      className="quest-scroll-item"
      style={posStyle}
      onClick={onClickQuestScroll}
    >
      <span className="quest-scroll-item__level">{quest.level}</span>
      <span className="quest-scroll-item__duration">
        {convertDuration(quest.duration)}
      </span>
      <span className="quest-scroll-item__tribute">{quest.tribute}</span>
      {quest.title}
    </div>
  );
};

export default QuestScrollItem;
