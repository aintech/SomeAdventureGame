export enum ActionType {
  FETCH_GAME_STATS_REQUEST,
  FETCH_GAME_STATS_SUCCESS,
  FETCH_QUESTS_REQUEST,
  FETCH_QUESTS_SUCCESS,
  FETCH_HEROES_REQUEST,
  FETCH_HEROES_SUCCESS,
  FETCH_TAVERN_PATRONS_REQUEST,
  FETCH_TAVERN_PATRONS_SUCCESS,

  BUILDING_CLICKED,
  QUEST_SCROLL_CHOOSED,
  QUEST_SCROLL_CLOSED,

  HERO_STATS_CHOOSED,
  HERO_STATS_CLOSED,

  HERO_ASSIGNED_TO_QUEST,
  HERO_DISMISSED_FROM_QUEST,
  HEROES_EMBARKED_ON_QUEST,

  CHECKPOINT_PASSED,

  COLLECTING_QUEST_REWARD,
  COMPLETE_QUEST,

  SHOW_USER_MESSAGE,
  DISMISS_USER_MESSAGE,

  HERO_HIRED,
}