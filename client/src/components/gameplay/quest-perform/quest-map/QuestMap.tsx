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
        strokeWidth="2"
        strokeDasharray={link.full ? undefined : '2px, 4px'}
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
  full: boolean;
};

// Опираемся на то что карта отцентрированна и занимает 70% высоты и 90% ширины экрана, а иконки 32x32.
const prepareLinks = (checkpoints: QuestCheckpoint[]) => {
  const links: Link[] = [];

  const dimensions = { height: window.innerHeight * 0.7, width: window.innerWidth * 0.9 };
  const bossStage = checkpoints.find((c) => c.type === CheckpointType.BOSS)!;

  checkpoints.forEach((ch) => {
    if (ch.linked) {
      ch.linked.forEach((l) => {
        const c = checkpoints.find((a) => a.id === l)!;
        const stage = checkpoints.filter((a) => a.stage === ch.stage).sort((a, b) => a.id - b.id);
        const nextStage = checkpoints.filter((a) => a.stage === ch.stage + 1).sort((a, b) => a.id - b.id);

        links.push({
          from: ch.id,
          to: c.id,
          x1: markerXPos(ch, stage, dimensions),
          y1: markerYPos(ch, bossStage, dimensions),
          x2: markerXPos(c, nextStage, dimensions),
          y2: markerYPos(c, bossStage, dimensions, true),
          full: (ch.status === CheckpointStatus.COMPLETED || ch.type === CheckpointType.START) && c.status === CheckpointStatus.COMPLETED,
        });
      });
    }
  });

  return links;
};

const markerXPos = (checkpoint: QuestCheckpoint, stage: QuestCheckpoint[], dimensions: { height: number; width: number }) => {
  const idx = stage.indexOf(checkpoint);

  const stageCenter = dimensions.width * 0.5;
  let offset = stageCenter;

  // При нечетном количестве чекпоинтов позиция центрального.
  if (stage.length % 2 === 1 && idx === Math.floor(stage.length * 0.5)) {
    return offset;
  }

  // Безхитростная логика, учитывающая не более 5 чекпоинтов на стейдже.
  const signum = idx < stage.length * 0.5 ? -1 : 1;
  let val = 1;
  if (idx === 0 || idx === stage.length - 1) {
    val = stage.length - 1;
  } else if (idx === 1 || idx === stage.length - 2) {
    val = stage.length % 2 === 0 ? stage.length * 0.5 - 1 : Math.floor(stage.length * 0.5);
  }

  return offset + signum * val * MARKER_GAP; // * (asTarget ? -1 : 1);
};

const markerYPos = (
  checkpoint: QuestCheckpoint,
  bossStage: QuestCheckpoint,
  dimensions: { height: number; width: number },
  asTarget: boolean = false
) => {
  // Расстояние между стейждами (количество междустейджевых пространств соответствует ид последнего стейджа).
  const stagesH = (bossStage.stage + 1) * MARKER_SIZE;
  const betweenStageHeight = (dimensions.height - stagesH) / bossStage.stage;

  return dimensions.height - MARKER_SIZE * (checkpoint.stage + 1) - betweenStageHeight * checkpoint.stage + (asTarget ? MARKER_SIZE : 0);
};

export default QuestMap;
