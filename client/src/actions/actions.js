const gameStatsRequested = () => {
  return {
    type: "FETCH_GAME_STATS_REQUEST",
  };
};

const gameStatsLoaded = (stats) => {
  return {
    type: "FETCH_GAME_STATS_SUCCESS",
    payload: stats,
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

const buildingClicked = (building) => {
  return {
    type: "BUILDING_CLICKED",
    payload: building,
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

const collectingQuestReward = (quest) => {
  return {
    type: "COLLECTING_QUEST_REWARD",
    payload: quest,
  };
};

const completeQuest = (payload) => {
  return {
    type: "COMPLETE_QUEST",
    payload: payload,
  };
};

const fetchGameStats = (apiService) => (auth) => (dispatch) => {
  dispatch(gameStatsRequested);
  apiService.getGameStats(auth).then((data) => dispatch(gameStatsLoaded(data)));
};

const fetchQuests = (apiService) => (auth) => (dispatch) => {
  dispatch(questsRequested);
  apiService.getQuests(auth).then((data) => dispatch(questsLoaded(data)));
};

const fetchHeroes = (apiService) => (auth) => (dispatch) => {
  dispatch(heroesRequested);
  apiService.getHeroes(auth).then((data) => dispatch(heroesLoaded(data)));
};

const embarkHeroesOnQuest = (apiService) => (auth, quest, assignedHeroes) => (
  dispatch
) => {
  apiService
    .embarkHeroesOnQuest(auth, quest, assignedHeroes)
    .then((data) => dispatch(heroesEmbarkedOnQuest(data)));
};

const onCompleteQuest = (apiService) => (auth, quest, heroes) => (dispatch) => {
  apiService
    .completeQuest(auth, quest, heroes)
    .then((data) => dispatch(completeQuest(data)));
};

export {
  fetchGameStats,
  fetchQuests,
  fetchHeroes,
  buildingClicked,
  questScrollChoosed,
  questScrollClosed,
  heroAssignedToQuest,
  heroDismissedFromQuest,
  embarkHeroesOnQuest,
  collectingQuestReward,
  onCompleteQuest,
};
