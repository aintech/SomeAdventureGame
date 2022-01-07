import { HeroWithSkills } from '../repository/hero/Hero';
import { getAllMonsters, Monster } from '../repository/Monster';
import { Quest } from '../repository/quest/Quest';
import {
  CheckpointLink,
  CheckpointStatus,
  CheckpointType,
  QuestCheckpoint,
  QuestCheckpointWithProgress,
} from '../repository/quest/QuestCheckpoint';
import { anyOf } from '../utils/Arrays';

export const generateCheckpoints = async (quest: Quest, embarkedHeroes: HeroWithSkills[]) => {
  const checkpoints: QuestCheckpoint[] = [];

  checkpoints.push({
    type: CheckpointType.START,
    stage: 0,
    passed: false,
    treasure: 0,
    status: CheckpointStatus.AVAILABLE,
  });

  const stagesCount = 5; //Math.floor(quest.duration * 0.5 * 0.1);

  for (let i = 1; i <= stagesCount; i++) {
    const prevStage: QuestCheckpoint[] = checkpoints.filter((c) => c.stage === i - 1);
    // на одном стейдже от 1 до 5 чекпоинтов, но не больше чем предыдущие * 2
    let stagedPoints = Math.floor(Math.random() * 5) + 1;
    if (stagedPoints > prevStage.length * 2) {
      stagedPoints = prevStage.length * 2;
    }

    for (let j = 0; j < stagedPoints; j++) {
      const type: number = CheckpointType.BATTLE; // i % 2 == 0 ? CheckpointType.BATTLE : CheckpointType.TREASURE; //Math.random() > 1 ? "treasure" : "battle";

      let treasure = 0;
      let enemies: Monster[] = [];
      switch (type) {
        case CheckpointType.BATTLE:
          enemies = await getMonsterParty(quest.level);
          break;
        case CheckpointType.TREASURE:
          treasure = quest.level * Math.floor(Math.random() * 20 + 10);
          break;
        default:
          throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
      }

      checkpoints.push({
        type,
        stage: i,
        treasure,
        enemies,
        passed: false,
        status: CheckpointStatus.AVAILABLE,
      });
    }
  }

  checkpoints.push({
    type: CheckpointType.BOSS,
    stage: stagesCount + 1,
    passed: false,
    treasure: 0,
    status: CheckpointStatus.AVAILABLE,
  });

  return checkpoints;
};

//FIXME: Периодически тут падаем
export const linkCheckpoints = (checkpoints: QuestCheckpointWithProgress[]): CheckpointLink[] => {
  const links: CheckpointLink[] = [];

  console.log('A');

  // Стартовая локация всегда линкуется на все первые локации.
  const start = checkpoints.find((c) => c.type === CheckpointType.START)!;
  links.push({ checkpointId: start.id!, linked: checkpoints.filter((c) => c.stage === 1).map((c) => c.id!) });

  const bossStage = checkpoints.find((c) => c.type === CheckpointType.BOSS)!;

  console.log('B');

  // Сразу коннектим последние локации к босс-локации.
  checkpoints
    .filter((c) => c.stage === bossStage.stage - 1)
    .forEach((c) =>
      links.push({
        checkpointId: c.id!,
        linked: [bossStage.id!],
      })
    );

  console.log('C');

  for (let i = 1; i < bossStage.stage - 1; i++) {
    const stage = checkpoints.filter((c) => c.stage === i).sort((a, b) => a.id! - b.id!);
    const nextStage = checkpoints.filter((c) => c.stage === i + 1).sort((a, b) => a.id! - b.id!);
    links.push(...connectStages(stage, nextStage));
  }

  console.log('D');

  return links;
};

/** Вместо нормальной логики, перебираем все корнеркейсы */
const connectStages = (stage: QuestCheckpointWithProgress[], nextStage: QuestCheckpointWithProgress[]) => {
  const links: CheckpointLink[] = stage.map((ch) => {
    return {
      checkpointId: ch.id!,
      linked: [],
    };
  });

  // Одинаковое количество чекпоинтов - коннектим напрямую, но лучше придумать поразнообразнее.
  if (stage.length === nextStage.length) {
    for (let i = 0; i < stage.length; i++) {
      addLink(links, stage[i].id!, nextStage[i].id!);
    }
  }

  // Если на текущем стейдже локаций больше чем на следующем.
  if (stage.length > nextStage.length) {
    // Сколько линков надо смержить.
    let diff = stage.length - nextStage.length;

    // Количество линков к чекпоинтам на следующем стейдже
    const toMerge: Map<number, number> = new Map(); //: { id: number; linksCount: number }[] = [];
    nextStage.forEach((c) => toMerge.set(c.id!, 1));

    while (diff > 0) {
      for (let i = 0; i < toMerge.size; i++) {
        if (Math.random() < 0.3) {
          const cId = nextStage[i].id!;
          toMerge.set(cId, toMerge.get(cId)! + 1);
          diff--;
        }
      }
    }

    for (let stageIdx = 0, nextStageIdx = 0; nextStageIdx < nextStage.length; nextStageIdx++) {
      const nextCheckpoint = nextStage[nextStageIdx];

      let linksCount = toMerge.get(nextCheckpoint.id!)!;
      while (linksCount > 0) {
        let checkpoint = stage[stageIdx];
        addLink(links, checkpoint.id!, nextCheckpoint.id!);
        stageIdx++;
        linksCount--;
      }
    }
  }

  // Если на текущем стейдже локаций меньше чем на следующем.
  if (stage.length < nextStage.length) {
    // фактически количество линков которые надо задвоить.
    const diff = nextStage.length - stage.length;

    // Идентификаторы чекпоинтов от которых разделяются линки.
    const doubled: number[] = [];

    // Задваиваем рендомно линки, пока их количество не сравняется со следующим стейджем.
    while (doubled.length !== diff) {
      for (let i = 0; i < diff; i++) {
        if (!doubled.includes(stage[i].id!) && Math.random() < 0.3) {
          doubled.push(stage[i].id!);
        }
      }
    }

    for (let stageIdx = 0, nextStageIdx = 0; stageIdx < stage.length; stageIdx++, nextStageIdx++) {
      const checkpoint = stage[stageIdx];
      addLink(links, checkpoint.id!, nextStage[nextStageIdx].id!);

      if (doubled.includes(checkpoint.id!)) {
        nextStageIdx++;
        addLink(links, checkpoint.id!, nextStage[nextStageIdx].id!);
      }
    }
  }

  return links;
};

const addLink = (links: CheckpointLink[], fromId: number, toId: number) => {
  links.find((c) => c.checkpointId === fromId)!.linked!.push(toId);
};

const getMonsterParty = async (level: number) => {
  const monsters = await getAllMonsters();

  const partyCount = 1; // Math.floor(Math.random() * 3) + 2;
  //Пока в базе есть только монстры 1 уровня
  const monstersByLevel = [...monsters]; //_monsters.filter((m) => m.level === level);
  const suitable: Monster[] = [];
  for (let i = 0; i < partyCount; i++) {
    const monster: Monster = JSON.parse(JSON.stringify(anyOf(monstersByLevel)));
    monster.actorId = i;
    suitable.push(monster);
  }

  return suitable;
};
