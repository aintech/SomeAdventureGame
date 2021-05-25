import { AuthProps } from "../contexts/AuthContext";
import GameStats from "../models/GameStats";
import { HeroResponse } from "./HeroesService";
import sendHttp from "./SendHttp";

const baseUrl = "/api/quests";

export interface CheckpointActorResponse {
  id: number;
  name: string;
}

export interface CheckpointResponse {
  id: number;
  occured_time: number;
  type: string;
  duration: number;
  outcome: string;
  actors: CheckpointActorResponse[];
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
  checkpoints: CheckpointResponse[];
}

const getQuests = async (auth: AuthProps) => {
  return await sendHttp<QuestResponse[]>(
    `${baseUrl}/${auth.userId}`,
    auth.token
  );
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
    `${baseUrl}/embark/${auth.userId}`,
    auth.token,
    "POST",
    body
  );
};

export interface CompleteQuestResponse {
  stats: GameStats;
  quest: QuestResponse;
  heroes: HeroResponse[];
}

const completeQuest = async (
  auth: AuthProps,
  questId: number,
  heroIds: number[]
) => {
  const body = { questId, heroIds };
  return await sendHttp<CompleteQuestResponse>(
    `${baseUrl}/complete/${auth.userId}`,
    auth.token,
    "POST",
    body
  );
};

export { getQuests, embarkOnQuest, completeQuest };
