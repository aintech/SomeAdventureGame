import React from "react";
import Quest from "../../../../../../models/Quest";
import { GUILD_SHARE } from "../../../../../../utils/Variables";
import "./quest-details.scss";

type QuestDetailsProps = {
  quest: Quest;
};

// TODO: заменить кнопку close на кнопку "Отменить" внизу

const QuestDetails = ({ quest }: QuestDetailsProps) => {
  return (
    <div className="quest-details">
      <div className="quest-details__title">{quest.title}</div>
      <div className="quest-details__level">Ур. {quest.level}</div>
      <div className="quest-details__description">{quest.description.replace(":tribute", quest.tribute.toString())}</div>
      <div className="quest-details__tribute">
        Доля гильдии {Math.floor(quest.tribute * GUILD_SHARE)} монет ({GUILD_SHARE * 100}%)
      </div>
      <div className="quest-details__experience">Опыт героям {quest.experience} очков</div>
    </div>
  );
};

export default QuestDetails;
