import { MouseEvent } from 'react';
import { Action } from 'redux';
import { Message } from '../components/message-popup/MessagePopup';
import Building from '../models/Building';
import GameStats from '../models/GameStats';
import Hero from '../models/hero/Hero';
import Quest from '../models/Quest';
import { EquipmentResponse, HeroResponse, HireHeroResponse, ItemResponse } from '../services/HeroService';
import { CheckpointPassedResponse, CompleteCancelQuestResponse, EmbarkOnQuestResponse, QuestResponse } from '../services/QuestService';
import { ActionType } from './ActionType';

export interface PayloadedAction extends Action<ActionType> {
  payload?: any;
}

export const logout = (): PayloadedAction => {
  return {
    type: ActionType.LOGOUT,
  };
};

export const gameStatsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_GAME_STATS_REQUEST,
  };
};

export const gameStatsLoaded = (stats: GameStats): PayloadedAction => {
  return {
    type: ActionType.FETCH_GAME_STATS_SUCCESS,
    payload: stats,
  };
};

export const questsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_QUESTS_REQUEST,
  };
};

export const questsLoaded = (quests: QuestResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_QUESTS_SUCCESS,
    payload: quests,
  };
};

export const heroesRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_HEROES_REQUEST,
  };
};

export const heroesLoaded = (heroes: HeroResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_HEROES_SUCCESS,
    payload: heroes,
  };
};

export const buildingsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_BUILDINGS_REQUEST,
  };
};

export const buildingsLoaded = (buildings: Building[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_BUILDINGS_SUCCESS,
    payload: buildings,
  };
};

export const tavernPatronsRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_TAVERN_PATRONS_REQUEST,
  };
};

export const tavernPatronsLoaded = (patrons: HeroResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_TAVERN_PATRONS_SUCCESS,
    payload: patrons,
  };
};

export const marketAssortmentRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_MARKET_ASSORTMENT_REQUEST,
  };
};

export const marketAssortmentLoaded = (assortment: EquipmentResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_MARKET_ASSORTMENT_SUCCESS,
    payload: assortment,
  };
};

export const alchemistAssortmentRequested = (): PayloadedAction => {
  return {
    type: ActionType.FETCH_ALCHEMIST_ASSORTMENT_REQUEST,
  };
};

export const alchemistAssortmentLoaded = (assortment: ItemResponse[]): PayloadedAction => {
  return {
    type: ActionType.FETCH_ALCHEMIST_ASSORTMENT_SUCCESS,
    payload: assortment,
  };
};

export const buildingClicked = (building?: Building): PayloadedAction => {
  return {
    type: ActionType.BUILDING_CLICKED,
    payload: building,
  };
};

export const heroStatsChoosed = (hero: Hero): PayloadedAction => {
  return {
    type: ActionType.HERO_STATS_CHOOSED,
    payload: hero,
  };
};

export const heroStatsDisplayClosed = (): PayloadedAction => {
  return {
    type: ActionType.HERO_STATS_DISPLAY_CLOSED,
  };
};

export const heroesEmbarkedOnQuest = (embarkedQuestAndHeroes: EmbarkOnQuestResponse): PayloadedAction => {
  return {
    type: ActionType.HEROES_EMBARKED_ON_QUEST,
    payload: embarkedQuestAndHeroes,
  };
};

export const checkpointPassed = (embarked: CheckpointPassedResponse): PayloadedAction => {
  return {
    type: ActionType.CHECKPOINT_PASSED,
    payload: embarked,
  };
};

export const clearCheckpointReward = (): PayloadedAction => {
  return {
    type: ActionType.CLEAR_CHECKPOINT_REWARD,
  };
};

export const completeQuest = (questResponse: CompleteCancelQuestResponse): PayloadedAction => {
  return {
    type: ActionType.COMPLETE_QUEST,
    payload: questResponse,
  };
};

export const cancelQuest = (questResponse: CompleteCancelQuestResponse): PayloadedAction => {
  return {
    type: ActionType.CANCEL_QUEST,
    payload: questResponse,
  };
};

export const showUserMessage = (message: Message): PayloadedAction => {
  return {
    type: ActionType.SHOW_USER_MESSAGE,
    payload: message,
  };
};

export const dismissUserMessage = (id: number): PayloadedAction => {
  return {
    type: ActionType.DISMISS_USER_MESSAGE,
    payload: id,
  };
};

export const heroHired = (hiredResult: HireHeroResponse): PayloadedAction => {
  return {
    type: ActionType.HERO_HIRED,
    payload: hiredResult,
  };
};

export const heroDismissed = (dismissResult: { heroId: number }): PayloadedAction => {
  return {
    type: ActionType.HERO_DISMISSED,
    payload: dismissResult.heroId,
  };
};

export const heroActivitiesUpdated = (heroes: HeroResponse[]): PayloadedAction => {
  return {
    type: ActionType.HERO_ACTIVITIES_UPDATED,
    payload: heroes,
  };
};

export const showTooltip = (appear: boolean = false, message: string = ''): PayloadedAction => {
  return {
    type: ActionType.SHOW_TOOLTIP,
    payload: { message, appear },
  };
};

export const showConfirmDialog = (message?: string, callback?: (e: MouseEvent) => void, event?: MouseEvent): PayloadedAction => {
  return {
    type: ActionType.SHOW_CONFIRM_DIALOG,
    payload: message ? { message, callback, event } : undefined,
  };
};

export const beginQuestPerform = (quest: Quest, heroes: Hero[]): PayloadedAction => {
  return {
    type: ActionType.BEGIN_QUEST_PROCESS,
    payload: { quest, heroes },
  };
};

export const closeQuestPerform = (): Action => {
  return {
    type: ActionType.CLOSE_QUEST_PROCESS,
  };
};

export const buildingUpgradeStarted = (data: { stats: GameStats; buildings: Building[] }): PayloadedAction => {
  return {
    type: ActionType.BUILDING_UPGRADE_STARTED,
    payload: data,
  };
};

export const buildingUpgradeCompleted = (buildings: Building[]): PayloadedAction => {
  return {
    type: ActionType.BUILDING_UPGRADE_COMPLETED,
    payload: buildings,
  };
};
