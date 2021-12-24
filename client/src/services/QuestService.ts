import { HeroEvent } from '../components/gameplay/quest-perform/quest-processes/battle-process/BattleProcess';
import { AuthProps } from '../contexts/AuthContext';
import GameStats from '../models/GameStats';
import Quest from '../models/Quest';
import { CheckpointType } from '../models/QuestCheckpoint';
import { HeroResponse } from './HeroService';
import sendHttp from './SendHttp';

const baseUrl = '/api/quest';

export interface CheckpointEnemyResponse {
  id: number;
  actorId: number;
  level: number;
  name: string;
  health: number;
  power: number;
  defence: number;
  initiative: number;
}

export interface CheckpointResponse {
  id: number;
  occuredAt: number;
  type: CheckpointType;
  passed: boolean;
  enemies?: CheckpointEnemyResponse[];
}

export interface QuestResponse {
  id: number;
  level: number;
  title: string;
  description: string;
  experience: number;
  duration: number;
  tribute: number;
  fame: number;
  progressId: number;
  progressDuration: number;
  embarkedTime: string;
  completed: boolean;
  checkpoints: CheckpointResponse[];
}

export const getQuests = async (auth: AuthProps) => {
  return await sendHttp<QuestResponse[]>(`${baseUrl}`, auth);
};

export interface EmbarkOnQuestResponse {
  embarkedQuests: QuestResponse;
  embarkedHeroes: HeroResponse[];
}

export const embarkOnQuest = async (auth: AuthProps, questId: number, heroIds: number[]) => {
  return await sendHttp<EmbarkOnQuestResponse>(`${baseUrl}/embark`, auth, [`quest_id=${questId}`, `hero_ids=${heroIds.join(',')}`], 'POST');
};

export interface CheckpointPassedBody {
  id: number;
  events?: { heroId: number; events: HeroEvent[] }[];
}

export interface CheckpointPassedResponse {
  embarkedQuest: Quest;
  embarkedHeroes: HeroResponse[];
}

export const checkpointPassed = async (auth: AuthProps, questId: number, result: CheckpointPassedBody) => {
  return await sendHttp<CheckpointPassedResponse>(
    `${baseUrl}/checkpoint-passed`,
    auth,
    [`quest_id=${questId}`, `checkpoint_id=${result.id}`],
    'POST',
    result
  );
};

export interface CompleteCancelQuestResponse {
  stats?: GameStats;
  quest: QuestResponse;
  heroes: HeroResponse[];
}

export const completeQuest = async (auth: AuthProps, questId: number) => {
  return await sendHttp<CompleteCancelQuestResponse>(`${baseUrl}/complete`, auth, [`quest_id=${questId}`], 'PUT');
};

export const cancelQuest = async (auth: AuthProps, questId: number) => {
  return await sendHttp<CompleteCancelQuestResponse>(`${baseUrl}/cancel`, auth, [`quest_id=${questId}`], 'PUT');
};
