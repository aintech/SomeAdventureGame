import Quest from '../../../../models/Quest';
import QuestCheckpoint, { CheckpointStatus, CheckpointType } from '../../../../models/QuestCheckpoint';
import './quest-map.scss';

type QuestMapProps = {
  quest: Quest;
  checkpointActivated: (checkpoint: QuestCheckpoint) => void;
};

const QuestMap = ({ quest, checkpointActivated }: QuestMapProps) => {
  const { checkpoints } = quest.progress!;
  const bossStage = checkpoints.find((c) => c.type === CheckpointType.BOSS)!;

  const chooseCheckpoint = (checkpoint: QuestCheckpoint) => {
    if (checkpoint.status === CheckpointStatus.CHOOSEABLE) {
      checkpointActivated(checkpoint);
    }
  };

  const stageMap = [];

  for (let i = 0; i <= bossStage.stage; i++) {
    stageMap[i] = checkpoints.filter((c) => c.stage === i);
  }

  const markerRenders = stageMap.map((stage) => {
    return (
      <div key={stage[0].stage} className="quest-map__stage">
        {stage
          .sort((a, b) => a.id - b.id)
          .map((ch) => {
            return (
              <div
                key={ch.id}
                onClick={() => chooseCheckpoint(ch)}
                className={`quest-map__checkpoint-marker quest-map__checkpoint-marker_type_${CheckpointType[ch.type].toLowerCase()}${
                  ch.status === CheckpointStatus.CHOOSEABLE
                    ? ' quest-map__checkpoint-marker_chooseable'
                    : ch.status === CheckpointStatus.DISABLED
                    ? ' quest-map__checkpoint-marker_disabled'
                    : ''
                }`}
              >
                {ch.status === CheckpointStatus.COMPLETED ? <div className="quest-map__checkpoint-marker_completed"></div> : null}
              </div>
            );
          })}
      </div>
    );
  });

  return <div className="quest-map__container">{markerRenders}</div>;
};

export default QuestMap;
