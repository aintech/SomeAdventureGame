const gameStatsRequested = () => {
  return {
    type: "FETCH_GAME_STATS_REQUEST",
  };
};

const gameStatsLoaded = (data) => {
  return {
    type: "FETCH_GAME_STATS_SUCCESS",
    payload: data,
  };
};

const buildingsRequested = () => {
  return {
    type: "FETCH_BUILDINGS_REQUEST",
  };
};

const buildingsLoaded = (data) => {
  return {
    type: "FETCH_BUILDINGS_SUCCESS",
    payload: data,
  };
};

const buildingClicked = (building) => {
  return {
    type: "BUILDING_CLICKED",
    payload: building,
  };
};

const questsRequested = () => {
  return {
    type: "FETCH_QUESTS_REQUEST",
  };
};

const questsLoaded = (quests) => {
  return {
    type: "FETCH_QUESTS_SUCCESS",
    payload: quests,
  };
};

const heroesRequested = () => {
  return {
    type: "FETCH_HEROES_REQUESTED",
  };
};

const heroesLoaded = (heroes) => {
  return {
    type: "FETCH_HEROES_SUCCESS",
    payload: heroes,
  };
};

const embarkedQuestsRequested = () => {
  return { type: "FETCH_EMBARKED_QUESTS_REQUEST" };
};

const embarkedQuestsLoaded = (embarkedQuests) => {
  return {
    type: "FETCH_EMBARKED_QUESTS_SUCCESS",
    payload: embarkedQuests,
  };
};

const questScrollChoosed = (quest) => {
  return {
    type: "QUEST_SCROLL_CHOOSED",
    payload: quest,
  };
};

const questScrollClosed = () => {
  return {
    type: "QUEST_SCROLL_CLOSED",
  };
};

const heroAssignedToQuest = (hero) => {
  return {
    type: "HERO_ASSIGNED_TO_QUEST",
    payload: hero,
  };
};

const heroDismissedFromQuest = (hero) => {
  return {
    type: "HERO_DISMISSED_FROM_QUEST",
    payload: hero,
  };
};

const heroesEmbarkedOnQuest = (payload) => {
  return {
    type: "HEROES_EMBARKED_ON_QUEST",
    payload: payload,
  };
};

const collectingQuestReward = (payload) => {
  return {
    type: "COLLECTING_QUEST_REWARD",
    payload: payload,
  };
};

const questRewardCollected = (payload) => {
  return {
    type: "QUEST_REWARD_COLLECTED",
    payload: payload,
  };
};

const fetchGameStats = (apiService) => () => (dispatch) => {
  dispatch(gameStatsRequested);
  apiService.getGameStats().then((data) => dispatch(gameStatsLoaded(data)));
};

const fetchBuildings = (apiService) => () => (dispatch) => {
  dispatch(buildingsRequested);
  apiService.getBuildings().then((data) => dispatch(buildingsLoaded(data)));
};

const fetchQuests = (apiService) => () => (dispatch) => {
  dispatch(questsRequested);
  apiService.getQuests().then((data) => dispatch(questsLoaded(data)));
};

const fetchHeroes = (apiService) => (auth) => (dispatch) => {
  dispatch(heroesRequested);
  apiService.getHeroes(auth).then((data) => dispatch(heroesLoaded(data)));
};

const fetchEmbarkedQuests = (apiService) => () => (dispatch) => {
  dispatch(embarkedQuestsRequested);
  apiService
    .getEmbarkedQuests()
    .then((data) => dispatch(embarkedQuestsLoaded(data)));
};

const embarkHeroesOnQuest = (apiService) => (payload) => (dispatch) => {
  apiService
    .embarkHeroesOnQuest(payload)
    .then((data) => dispatch(heroesEmbarkedOnQuest(data)));
};

const onQuestRewardCollected = (apiService) => (payload) => (dispatch) => {
  apiService
    .questRewardCollected(payload)
    .then((data) => dispatch(questRewardCollected(data)));
};

export {
  fetchGameStats,
  fetchBuildings,
  fetchQuests,
  fetchHeroes,
  fetchEmbarkedQuests,
  buildingClicked,
  questScrollChoosed,
  questScrollClosed,
  heroAssignedToQuest,
  heroDismissedFromQuest,
  embarkHeroesOnQuest,
  collectingQuestReward,
  onQuestRewardCollected,
};
