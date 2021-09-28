import Hero from "../../../../models/hero/Hero";
import Quest from "../../../../models/Quest";
import "./quest-complete.scss";

type QuestCompleteProps = {
  quest: Quest;
  heroes: Hero[];
};

const QuestComplete = ({ quest, heroes }: QuestCompleteProps) => {
  return <div className="quest-complete">QUEST {quest.title} COMPLETED!!!</div>;
};

export default QuestComplete;
