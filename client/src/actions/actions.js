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

const fetchBuildings = (apiService) => () => (dispatch) => {
  dispatch(buildingsRequested());
  apiService.getBuildings().then((data) => dispatch(buildingsLoaded(data)));
};

const fetchQuests = (apiService) => () => (dispatch) => {
  dispatch(questsRequested());
  apiService.getQuests().then((data) => dispatch(questsLoaded(data)));
};

const fetchHeroes = (apiService) => () => (dispatch) => {
  dispatch(heroesRequested);
  apiService.getHeroes().then((data) => dispatch(heroesLoaded(data)));
};

export {
  fetchBuildings,
  fetchQuests,
  fetchHeroes,
  buildingClicked,
  questScrollChoosed,
  questScrollClosed,
  heroAssignedToQuest,
  heroDismissedFromQuest,
};
