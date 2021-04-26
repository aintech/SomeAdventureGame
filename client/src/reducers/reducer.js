import { convertHero } from "./converters";

const intialState = {
  gold: 0,
  fame: 0,
  buildings: [],
  quests: [],
  heroes: [],
  chosenBuilding: null,
  chosenQuest: null,
  heroesAssignedToQuest: [],
  embarkedQuests: [],
  collectingQuestReward: null,
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case "FETCH_GAME_STATS_REQUEST":
      return {
        ...state,
        gold: 0,
        fame: 0,
      };

    case "FETCH_GAME_STATS_SUCCESS":
      return {
        ...state,
        gold: action.payload.gold,
        fame: action.payload.fame,
      };

    case "FETCH_BUILDINGS_REQUEST":
      return {
        ...state,
        buildings: [],
      };

    case "FETCH_BUILDINGS_SUCCESS":
      return {
        ...state,
        buildings: action.payload,
      };

    case "BUILDING_CLICKED":
      return {
        ...state,
        chosenBuilding: action.payload,
      };

    case "FETCH_QUESTS_REQUEST":
      return {
        ...state,
        quests: [],
      };

    case "FETCH_QUESTS_SUCCESS":
      return {
        ...state,
        quests: action.payload,
      };

    case "FETCH_HEROES_REQUEST":
      return {
        ...state,
        heroes: [],
      };

    case "FETCH_HEROES_SUCCESS":
      return {
        ...state,
        heroes: action.payload.map((h) => convertHero(h)),
      };

    case "FETCH_EMBARKED_QUESTS_REQUEST":
      return {
        ...state,
        embarkedQuests: [],
      };

    case "FETCH_EMBARKED_QUESTS_SUCCESS":
      return {
        ...state,
        embarkedQuests: action.payload,
      };

    case "QUEST_SCROLL_CHOOSED":
      return {
        ...state,
        chosenQuest: action.payload,
      };

    case "QUEST_SCROLL_CLOSED":
      return {
        ...state,
        chosenQuest: null,
        heroesAssignedToQuest: [],
      };

    case "HERO_ASSIGNED_TO_QUEST":
      return {
        ...state,
        heroesAssignedToQuest: [...state.heroesAssignedToQuest, action.payload],
      };

    case "HERO_DISMISSED_FROM_QUEST":
      const idx = state.heroesAssignedToQuest.findIndex(
        (hero) => hero.id === action.payload.id
      );
      return {
        ...state,
        heroesAssignedToQuest: [
          ...state.heroesAssignedToQuest.slice(0, idx),
          ...state.heroesAssignedToQuest.slice(idx + 1),
        ],
      };

    case "HEROES_EMBARKED_ON_QUEST":
      const { quest, heroesAssignedToQuest } = action.payload;
      return {
        ...state,
        chosenQuest: null,
        heroesAssignedToQuest: [],
        embarkedQuests: [
          ...state.embarkedQuests,
          { key: quest, value: heroesAssignedToQuest },
        ],
      };

    case "COLLECTING_QUEST_REWARD":
      return {
        ...state,
        collectingQuestReward: action.payload,
      };

    case "QUEST_REWARD_COLLECTED":
      const embIdx = state.embarkedQuests.findIndex(
        (emb) => emb.key.id === action.payload.questId
      );
      return {
        ...state,
        gold: action.payload.gold,
        fame: action.payload.fame,
        collectingQuestReward: null,
        embarkedQuests: [
          ...state.embarkedQuests.slice(0, embIdx),
          ...state.embarkedQuests.slice(embIdx + 1),
        ],
      };

    default:
      return state;
  }
};

export default reducer;
