import { AuthProps } from "../contexts/AuthContext";
import GameStats from "../models/GameStats";
import Quest from "../models/Quest";
import { HeroResponse } from "./HeroesService";
import sendHttp from "./SendHttp";

const baseUrl = "/api/quests";

export interface CheckpointEnemyResponse {
  id: number;
  actorId: number;
  name: string;
  health: number;
}

export interface CheckpointResponse {
  id: number;
  occured_at: number;
  type: string;
  duration: number;
  outcome: string;
  enemies: string;
  tribute: string;
  passed: boolean;
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
  progress_id: number;
  progress_duration: number;
  embarked_time: string;
  completed: boolean;
  checkpoints: CheckpointResponse[];
}

const getQuests = async (auth: AuthProps) => {
  return await sendHttp<QuestResponse[]>(`${baseUrl}`, auth);
};

export interface EmbarkOnQuestResponse {
  embarkedQuests: QuestResponse[];
  embarkedHeroes: HeroResponse[];
}

const embarkOnQuest = async (
  auth: AuthProps,
  questId: number,
  heroIds: number[]
) => {
  const body = { questId, heroIds };
  return await sendHttp<EmbarkOnQuestResponse>(
    `${baseUrl}/embark`,
    auth,
    [],
    "POST",
    body
  );
};

export interface CheckpointPassedResponse {
  embarkedQuest: Quest;
  embarkedHeroes: HeroResponse[];
}

const checkpointPassed = async (
  auth: AuthProps,
  questId: number,
  checkpointId: number
) => {
  return await sendHttp<CheckpointPassedResponse>(
    `${baseUrl}/checkpoint`,
    auth,
    [`quest_id=${questId}`, `checkpoint_id=${checkpointId}`],
    "PUT"
  );
};

export interface CompleteCancelQuestResponse {
  stats: GameStats | null;
  quest: QuestResponse;
  heroes: HeroResponse[];
}

const completeQuest = async (auth: AuthProps, questId: number) => {
  return await sendHttp<CompleteCancelQuestResponse>(
    `${baseUrl}/complete`,
    auth,
    [`quest_id=${questId}`],
    "PUT"
  );
};

const cancelQuest = async (auth: AuthProps, questId: number) => {
  return await sendHttp<CompleteCancelQuestResponse>(
    `${baseUrl}/cancel`,
    auth,
    [`quest_id=${questId}`],
    "PUT"
  );
};

export {
  getQuests,
  embarkOnQuest,
  checkpointPassed,
  completeQuest,
  cancelQuest,
};
