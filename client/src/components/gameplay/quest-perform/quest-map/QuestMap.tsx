import Quest from '../../../../models/Quest';
import QuestCheckpoint, { CheckpointStatus, CheckpointType } from '../../../../models/QuestCheckpoint';
import './quest-map.scss';

const MARKER_SIZE = 32;
const MARKER_GAP = 32;

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

  const links = prepareLinks(checkpoints);
  const linkRenders = links.map((link) => (
    <svg key={`${link.from}-${link.to}`} className="quest-map__link">
      <line
        id={`${link.from}-${link.to}`}
        x1={link.x1}
        y1={link.y1}
        x2={link.x2}
        y2={link.y2}
        stroke="#151515"
        strokeWidth="3"
        fill="none"
      ></line>
    </svg>
  ));

  return (
    <div className="quest-map">
      <div className="quest-map__markers">{markerRenders}</div>
      <div className="quest-map__links">{linkRenders}</div>
    </div>
  );
};

type Link = {
  from: number;
  to: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

// Опираемся на то что карта отцентрированна и занимает 70% высоты и 90% ширины экрана, а иконки 32x32.
const prepareLinks = (checkpoints: QuestCheckpoint[]) => {
  const bossStage = checkpoints.find((c) => c.type === CheckpointType.BOSS)!;
  const links: Link[] = [];

  const dimensions = { height: window.innerHeight * 0.7, width: window.innerWidth * 0.9 };

  // Расстояние между стейждами (количество междустейджевых пространств соответствует ид последнего стейджа).
  const stagesH = bossStage.stage * MARKER_SIZE;
  const betweenStageHeight = (dimensions.height - stagesH) / bossStage.stage - 8;

  checkpoints.forEach((ch) => {
    if (ch.linked) {
      ch.linked.forEach((l) => {
        const c = checkpoints.find((a) => a.id === l)!;
        links.push({
          from: ch.id,
          to: c.id,
          x1: markerOffset(
            ch,
            checkpoints.filter((a) => a.stage === ch.stage).sort((a, b) => a.id - b.id),
            dimensions
          ),
          y1: dimensions.height - MARKER_SIZE,
          x2: dimensions.width * 0.5,
          y2: 0,
        });
      });
    }
  });

  // const startStage = checkpoints.find((ch) => ch.type === CheckpointType.START)!;
  // links.push({
  //   from: startStage.id,
  //   to: bossStage.id,
  //   x1: dimensions.width * 0.5,
  //   y1: dimensions.height - MARKER_SIZE,
  //   x2: dimensions.width * 0.5,
  //   y2: dimensions.height - MARKER_SIZE - betweenStageHeight,
  // });

  return links;
};

const markerOffset = (checkpoint: QuestCheckpoint, stage: QuestCheckpoint[], dimensions: { height: number; width: number }) => {
  const idx = stage.indexOf(checkpoint);

  const stageCenter = dimensions.width * 0.5;
  let offset = stageCenter;

  switch (stage.length) {
    case 2:
      if (idx === 0) {
        return offset - MARKER_GAP;
      }
      return offset + MARKER_GAP;
    case 3:
      if (idx === 0) {
        return offset - 2 * MARKER_GAP;
      } else if (idx === 2) {
        return offset + 2 * MARKER_GAP;
      }
      return offset;
    case 4:
      if (idx === 0) {
        return offset - 3 * MARKER_GAP;
      } else if (idx === 1) {
        return offset - MARKER_GAP;
      } else if (idx === 2) {
        return offset + MARKER_GAP;
      } else if (idx === 3) {
        return offset + 3 * MARKER_GAP;
      }
      return offset;
    case 5:
      if (idx === 0) {
        return offset - 4 * MARKER_GAP;
      } else if (idx === 1) {
        return offset - 2 * MARKER_GAP;
      } else if (idx === 3) {
        return offset + 2 * MARKER_GAP;
      } else if (idx === 4) {
        return offset + 4 * MARKER_GAP;
      }
      return offset;
    default:
      return offset;
  }
};

export default QuestMap;
