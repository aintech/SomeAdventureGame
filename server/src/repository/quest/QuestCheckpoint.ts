import { CheckpointPassedBody } from '../../routes/QuestRoutes';
import query, { single } from '../Db';
import { adjustGoldExperience, adjustHealth, adjustMana, HeroWithSkills, setHeroHealth, setHeroMana } from '../hero/Hero';
import { adjustItems } from '../Item';
import { Monster } from '../Monster';
import { getQuestProgress } from './QuestProgress';

export enum CheckpointType {
  // Стартовый чекпоинт, всегда есть и всегда один.
  START,
  // Финальный чекпоинт, битва с боссом, всегда есть и всегда один.
  BOSS,
  // Чекпоинт с боем.
  BATTLE,
  // Чекпоинт с сокровищами.
  TREASURE,
  // Чекпоинт с лагерем в котором героои могут отдохунть и восполнить жизнь/ману.
  CAMP,
}

export enum CheckpointStatus {
  // Стандартный статус, чекпоинт расположен вверх по пути, и до него теоретически можно дойти.
  AVAILABLE,
  // Чекпоинт можно выбать и зайти на него, расположен сразу после последнего пройденного чекпоиинта.
  CHOOSEABLE,
  // До данного чекпоинта невозможно дойти, например на данном стейдже уже пройден другой чекпоинт.
  DISABLED,
  // Чекпоинит завершён.
  COMPLETED,
}

export type QuestCheckpoint = {
  id?: number /** empty when checkpoint not persist yet */;
  type: CheckpointType;
  stage: number;
  passed: boolean;
  status: CheckpointStatus;
  treasure?: number;
  enemies?: Monster[];
  linked?: number[];
};

export type CheckpointReward = {
  checkpointId: number;
  rewards: { heroId: number; gold: number; experience: number }[];
};

export type CheckpointLink = {
  checkpointId: number;
  linked: number[] | undefined;
};

export type QuestCheckpointWithProgress = QuestCheckpoint & {
  progressId?: number /** empty when progress not persist yet */;
  questId: number;
  embarkedTime: Date;
};

export const persistQuestCheckpoints = async (progressId: number, checkpoints: QuestCheckpoint[]) => {
  const checkpointsData = checkpoints
    .map(
      (checkpoint) =>
        `select 
          ${progressId},
          '${CheckpointType[checkpoint.type].toLowerCase()}', 
          ${checkpoint.stage}`
    )
    .join(' union all ');

  await query<void>(
    'persistQuestCheckpoints',
    `insert into public.quest_checkpoint 
     (quest_progress_id, type, stage)
     select * from (${checkpointsData}) as vals`
  );

  return getQuestCheckpoints([progressId]);
};

export const getQuestCheckpoint = async (checkpointId: number) => {
  return query<QuestCheckpointWithProgress>(
    'getQuestCheckpoint',
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where checkpoint.id = $1`,
    [checkpointId],
    mapQuestCheckpointWithProgress,
    single
  );
};

export const getQuestCheckpoints = async (progressIds: number[]) => {
  if (progressIds.length === 0) {
    return [];
  }
  const checkpoints = await query<QuestCheckpointWithProgress[]>(
    'getQuestCheckpoints',
    `select 
          checkpoint.*, 
          progress.quest_id,
          progress.embarked_time 
     from public.quest_checkpoint checkpoint
     left join quest_progress progress on progress.id = checkpoint.quest_progress_id
     where quest_progress_id in (${progressIds.join(',')})`,
    [],
    mapQuestCheckpointWithProgress
  );

  return calcCheckpointStatuses(checkpoints);
};

export const updateCheckpoints = async (checkpoints: QuestCheckpointWithProgress[]) => {
  const updates = checkpoints.map((ch) => {
    return `(
      ${ch.id},
      '${CheckpointType[ch.type].toLowerCase()}',
      ${ch.enemies ? `'${JSON.stringify(ch.enemies)}'` : null},
      ${ch.treasure}
    )
    `;
  });

  await query(
    'updateCheckpoints',
    `update public.quest_checkpoint ch set
      type = c.type,
      enemies = c.enemies,
      treasure = c.treasure
      from (values
      ${updates.join(',')}
      ) as c(id, type, enemies, treasure)
      where ch.id = c.id`
  );
};

const calcCheckpointStatuses = (checkpoints: QuestCheckpointWithProgress[]) => {
  // Если у чекпоинтов нету линков сразу возвращаемся (это происходит когда чекпонты только что записались в базу перед линковкой)
  if (checkpoints.every((ch) => !ch.linked)) {
    return checkpoints;
  }

  // Сразу помечаем пройденные чекпоинты.
  checkpoints.forEach((ch) => {
    if (ch.passed) {
      ch.status = CheckpointStatus.COMPLETED;
    }
  });

  // Разделяем чекпоинты по квестам
  const checkpointsInQuest: Map<number, QuestCheckpointWithProgress[]> = new Map();
  checkpoints.forEach((ch) => {
    if (!checkpointsInQuest.has(ch.questId)) {
      checkpointsInQuest.set(ch.questId, [ch]);
    } else {
      checkpointsInQuest.set(ch.questId, [...checkpointsInQuest.get(ch.questId)!, ch]);
    }
  });

  checkpointsInQuest.forEach((checks, _) => {
    // Если start слинкован с чекпоинтами (это те что stage = 1) которые ещё не пройдены, то они chooseable.
    const startLinks = checks.filter((ch) => ch.stage === 1);
    if (startLinks.every((ch) => !ch.passed)) {
      startLinks.forEach((ch) => (ch.status = CheckpointStatus.CHOOSEABLE));
    } else {
      // Если на чекпоинты линкуется пройденный чекпоинт с предыдущего стейджа, но при этом на текущем стейдже нет пройденных, то он доступен для выбора.
      checks
        .filter((ch) => ch.passed && ch.type !== CheckpointType.START && ch.type !== CheckpointType.BOSS)
        .forEach((ch) => {
          const linked = checks.filter((c) => ch.linked!.includes(c.id!));
          if (!linked.some((ch) => ch.passed)) {
            linked.forEach((c) => (c.status = CheckpointStatus.CHOOSEABLE));
            return;
          }
        });
    }

    // Если на текущем стейдже уже есть пройденный чекпоинт, то остальные недоступны.
    const bossStage = checks.find((ch) => ch.type === CheckpointType.BOSS)!;
    for (let i = 1; i < bossStage.stage; i++) {
      const stage = checks.filter((ch) => ch.stage === i);
      if (stage.some((ch) => ch.passed)) {
        stage.forEach((ch) => {
          if (!ch.passed) {
            ch.status = CheckpointStatus.DISABLED;
          }
        });
      }
    }

    // Если на чекпоинт ссылаются только недоступные чекпоинты, то он тоже недоступен.
    for (let i = 1; i < bossStage.stage; i++) {
      const stage = checks.filter((ch) => ch.stage === i);
      const prevStage = checks.filter((ch) => ch.stage === i - 1);

      for (let j = 0; j < stage.length; j++) {
        const ch = stage[j];
        const linkedDisabled = prevStage.filter((c) => c.linked!.includes(ch.id!)).every((c) => c.status === CheckpointStatus.DISABLED);
        if (linkedDisabled) {
          ch.status = CheckpointStatus.DISABLED;
        }
      }
    }
  });

  return checkpoints;
};

export const getQuestCheckpointsByQuest = async (userId: number, questId: number) => {
  const progress = await getQuestProgress(userId, questId);
  return getQuestCheckpoints([progress.id]);
};

export const checkpointPassed = async (checkpoint: QuestCheckpointWithProgress, heroes: HeroWithSkills[], result: CheckpointPassedBody) => {
  if (checkpoint.passed) {
    return;
  }

  const adjustments: Promise<any>[] = [];

  let gold = checkpoint.treasure ?? 0;
  let experience = 0;

  if (checkpoint.enemies) {
    gold += checkpoint.enemies.reduce((g, e) => g + e.loot.gold, 0);
    experience = checkpoint.enemies.reduce((a, b) => a + b.experience, 0);
  }

  const goldPerHero = gold > 0 ? Math.ceil(gold / heroes.length) : 0;
  const experiencePerHero = experience > 0 ? Math.ceil(experience / heroes.length) : 0;

  if (result.events) {
    heroes.forEach((h) => {
      const events = result.events!.find((e) => e.heroId === h.id)?.events;
      if (events) {
        let hpAdjust = 0;
        let manaAdjust = 0;
        events
          .sort((a, b) => a.time - b.time)
          .forEach((e) => {
            hpAdjust += e.hpAlter ?? 0;
            manaAdjust += e.manaAlter ?? 0;
          });

        const usedItems: Map<number, number> = new Map();
        events
          .filter((e) => e.itemId)
          .forEach((e) => {
            usedItems.set(e.itemId!, (usedItems.get(e.itemId!) ?? 0) - 1);
          });

        usedItems.forEach((amount, itemId) => {
          adjustments.push(adjustItems(h.id, itemId, amount));
        });

        adjustments.push(adjustHealth(h.id, hpAdjust));
        adjustments.push(adjustMana(h.id, manaAdjust));
      }
    });
  }

  if (checkpoint.type === CheckpointType.CAMP) {
    heroes.forEach((h) => {
      adjustments.push(setHeroHealth(h.id, h.vitality * 10));
      adjustments.push(setHeroMana(h.id, h.wizdom * 10));
    });
  }

  heroes.forEach((h) => {
    adjustments.push(adjustGoldExperience(h.id, goldPerHero, experiencePerHero));
  });

  if (adjustments.length > 0) {
    await Promise.all(adjustments);
  }

  await markAsPassed(checkpoint.id!);

  const reward: CheckpointReward = { checkpointId: checkpoint.id!, rewards: [] };
  heroes.forEach((h) => reward.rewards.push({ heroId: h.id, gold: goldPerHero, experience: experiencePerHero }));

  return reward;
};

const markAsPassed = (checkpointId: number) => {
  return query<void>('markAsPassed', `update public.quest_checkpoint set passed = true where id = $1`, [checkpointId]);
};

export const deleteCheckpoints = (progressId: number) => {
  return query<void>(
    'deleteCheckpoint',
    `delete from public.quest_checkpoint 
     where quest_progress_id = $1`,
    [progressId]
  );
};

export const persistLinks = async (links: CheckpointLink[]) => {
  const values: string[] = [];

  links.forEach((link) => {
    values.push(`
      (
        ${link.checkpointId},
        '${link.linked?.join(',')}'
      )
    `);
  });

  await query<void>(
    'persistLinks',
    `update public.quest_checkpoint ch set
      linked = c.linked
      from (values
      ${values.join(',')}
      ) as c(id, linked)
      where ch.id = c.id`
  );
};

type CheckpointWithProgressRow = {
  id: string;
  type: string;
  stage: string;
  enemies: string | null;
  passed: boolean;
  treasure: string;
  quest_progress_id: string;
  quest_id: string;
  embarked_time: Date;
  linked: string;
};

const mapQuestCheckpointWithProgress = (row: CheckpointWithProgressRow): QuestCheckpointWithProgress => {
  return {
    id: +row.id,
    type: mapCheckpointType(row.type),
    stage: +row.stage,
    enemies: mapEnemies(row.enemies),
    passed: row.passed,
    status: CheckpointStatus.AVAILABLE,
    treasure: +row.treasure,
    progressId: +row.quest_progress_id,
    questId: +row.quest_id,
    embarkedTime: row.embarked_time,
    linked: row.linked ? row.linked.split(',').map((v) => +v) : undefined,
  };
};

const mapCheckpointType = (type: string) => {
  switch (type) {
    case 'start':
      return CheckpointType.START;
    case 'boss':
      return CheckpointType.BOSS;
    case 'battle':
      return CheckpointType.BATTLE;
    case 'treasure':
      return CheckpointType.TREASURE;
    case 'camp':
      return CheckpointType.CAMP;
    default:
      throw new Error(`Unknown checkpoint type ${type}`);
  }
};

const mapEnemies = (enemies: string | null) => {
  if (!enemies) {
    return undefined;
  }
  return JSON.parse(enemies) as Monster[];
};
