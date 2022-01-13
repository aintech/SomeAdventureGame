import { HeroWithSkills } from '../repository/hero/Hero';
import { getAllMonsters, Monster, prepareMonsters } from '../repository/Monster';
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
    status: CheckpointStatus.AVAILABLE,
  });

  // На карте от 3 до 7 стейджев
  const stagesCount = 3 + Math.floor(Math.random() * 5);

  for (let i = 1; i <= stagesCount; i++) {
    const prevStage: QuestCheckpoint[] = checkpoints.filter((c) => c.stage === i - 1);
    // на одном стейдже от 1 до 5 чекпоинтов, но не больше чем предыдущие * 2
    let stagedPoints = Math.floor(Math.random() * 5) + 1;
    if (stagedPoints > prevStage.length * 2) {
      stagedPoints = prevStage.length * 2;
    }

    for (let j = 0; j < stagedPoints; j++) {
      checkpoints.push({
        type: CheckpointType.BATTLE,
        stage: i,
        passed: false,
        status: CheckpointStatus.AVAILABLE,
      });
    }
  }

  checkpoints.push({
    type: CheckpointType.BOSS,
    stage: stagesCount + 1,
    passed: false,
    status: CheckpointStatus.AVAILABLE,
  });

  return checkpoints;
};

export const linkCheckpoints = (checkpoints: QuestCheckpointWithProgress[]): CheckpointLink[] => {
  const links: CheckpointLink[] = [];

  // Стартовая локация всегда линкуется на все первые локации.
  const start = checkpoints.find((c) => c.type === CheckpointType.START)!;
  links.push({ checkpointId: start.id!, linked: checkpoints.filter((c) => c.stage === 1).map((c) => c.id!) });

  const bossStage = checkpoints.find((c) => c.type === CheckpointType.BOSS)!;

  // Сразу коннектим последние локации к босс-локации.
  checkpoints
    .filter((c) => c.stage === bossStage.stage - 1)
    .forEach((c) =>
      links.push({
        checkpointId: c.id!,
        linked: [bossStage.id!],
      })
    );

  for (let i = 1; i < bossStage.stage - 1; i++) {
    const stage = checkpoints.filter((c) => c.stage === i).sort((a, b) => a.id! - b.id!);
    const nextStage = checkpoints.filter((c) => c.stage === i + 1).sort((a, b) => a.id! - b.id!);
    links.push(...connectStages(stage, nextStage));
  }

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
    const toMerge: Map<number, number> = new Map();
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

        if (checkpoint) {
          addLink(links, checkpoint.id!, nextCheckpoint.id!);
          stageIdx++;
        }

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

/**
 * Определяем состояние чекпоинта - тип, монстры, награда и т.д.
 */
export const defineCheckpoints = async (quest: Quest, checkpoints: QuestCheckpointWithProgress[]) => {
  await prepareMonsters();

  checkpoints.forEach((ch) => {
    if (ch.type === CheckpointType.START) {
      return;
    }

    if (ch.type === CheckpointType.BOSS) {
      ch.enemies = getMonsterParty(quest.level, true);
      return;
    }

    let type: number = CheckpointType.BATTLE; // i % 2 == 0 ? CheckpointType.BATTLE : CheckpointType.TREASURE; //Math.random() > 1 ? "treasure" : "battle";

    const path = pathToCheckpoint(ch, checkpoints);

    if (checkpoints.find((c) => c.type === CheckpointType.BOSS)?.stage === ch.stage + 1) {
      console.log('----------------------');
      console.log('from: ', ch.id);
      console.log(path.map((chs) => chs.map((c) => c.id)));
      console.log('----------------------');
    }

    if (ch.stage > 2 && !haveCampsBefore(path) && Math.random() > 0.5) {
      type = CheckpointType.CAMP;
    }

    ch.type = type;
    switch (type) {
      case CheckpointType.BATTLE:
        ch.enemies = getMonsterParty(quest.level);
        break;
      case CheckpointType.TREASURE:
        ch.treasure = quest.level * Math.floor(Math.random() * 20 + 10);
        break;
      case CheckpointType.CAMP:
        break;
      default:
        throw new Error(`Unknown checkpoint type ${CheckpointType[type]}`);
    }
  });

  return checkpoints;
};

const haveCampsBefore = (path: QuestCheckpoint[][], depth: number = 1) => {
  let haveCamps = false;

  let stageDepth = depth;
  path.forEach((p) => {
    p.forEach((pa) => {
      haveCamps = haveCamps || pa.type === CheckpointType.CAMP;
    });
    stageDepth--;
    if (stageDepth === 0) {
      return;
    }
  });

  return haveCamps;
};

/**
 * Путь от начала до текущего чекпоинта.
 */
const pathToCheckpoint = (checkpoint: QuestCheckpointWithProgress, checkpoints: QuestCheckpointWithProgress[]) => {
  const path: QuestCheckpoint[][] = [];
  for (let i = 0; i <= checkpoint.stage; i++) {
    path.push([]);
  }

  path[checkpoint.stage] = [checkpoint];

  // Идём от чекпоинта вниз по пути до START стейджа.
  for (let i = checkpoint.stage - 1; i >= 0; i--) {
    const previous = path[i + 1];
    const current = checkpoints.filter((ch) => ch.stage === i).filter((ch) => previous.find((prev) => ch.linked!.includes(prev.id!)));
    path[i] = current;
  }

  return path;
};

const getMonsterParty = (level: number, boss?: boolean) => {
  const monsters = getAllMonsters();
  const partyCount = boss ? 1 : 2 + Math.floor(Math.random() * 4);
  //Пока в базе есть только монстры 1 уровня
  const monstersByLevel = [...monsters]; //_monsters.filter((m) => m.level === level);
  const suitable: Monster[] = [];
  for (let i = 0; i < partyCount; i++) {
    const monster: Monster = JSON.parse(JSON.stringify(anyOf(monstersByLevel)));
    monster.actorId = i;
    if (boss) {
      monster.health *= 3;
    }
    suitable.push(monster);
  }

  return suitable;
};
