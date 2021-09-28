import Quest from "../../../../models/Quest";
import QuestCheckpoint from "../../../../models/QuestCheckpoint";
import "./quest-map.scss";

type QuestMapProps = {
  quest: Quest;
  checkpointActivated: (checkpoint: QuestCheckpoint) => void;
};

const QuestMap = ({ quest, checkpointActivated }: QuestMapProps) => {
  const sorted = quest.progress!.checkpoints.sort((a, b) => a.occuredTime - b.occuredTime);
  let currentCheckpoint = sorted[sorted.length - 1];
  sorted.forEach((c) => {
    if (!c.passed && c.occuredTime < currentCheckpoint.occuredTime) {
      currentCheckpoint = c;
    }
  });

  const chooseCheckpoint = (checkpoint: QuestCheckpoint) => {
    if (checkpoint.id !== currentCheckpoint.id) {
      return;
    }
    checkpointActivated(checkpoint);
  };

  const markerRenders = sorted.map((c) => {
    return (
      <div
        key={c.id}
        onClick={() => chooseCheckpoint(c)}
        className={`quest-map__checkpoint-marker ${
          c.passed
            ? "quest-map__checkpoint-marker--passed"
            : c.id === currentCheckpoint.id
            ? "quest-map__checkpoint-marker--active"
            : "quest-map__checkpoint-marker--inactive"
        }`}
      ></div>
    );
  });

  return <div className="quest-map__container">{markerRenders}</div>;
};

export default QuestMap;
