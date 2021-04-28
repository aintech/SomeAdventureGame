import { convertHero, convertQuest } from "./converters";

const intialState = {
  gold: 0,
  fame: 0,
  quests: [],
  heroes: [],
  chosenBuilding: null,
  chosenQuest: null,
  heroesAssignedToQuest: [],
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

    case "FETCH_QUESTS_REQUEST":
      return {
        ...state,
        quests: [],
      };

    case "FETCH_QUESTS_SUCCESS":
      return {
        ...state,
        quests: action.payload.map((q) => convertQuest(q)),
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

    case "BUILDING_CLICKED":
      return {
        ...state,
        chosenBuilding: action.payload,
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
      const { embarkedQuests, embarkedHeroes } = action.payload;

      const questIdx = state.quests.findIndex(
        (q) => q.id === embarkedQuests[0].id
      );

      let upHeroes = [...state.heroes];
      for (let i = 0; i < embarkedHeroes.length; i++) {
        const hero = convertHero(embarkedHeroes[i]);
        const heroIdx = upHeroes.findIndex((h) => h.id === hero.id);
        upHeroes = [
          ...upHeroes.slice(0, heroIdx),
          hero,
          ...upHeroes.slice(heroIdx + 1),
        ];
      }

      return {
        ...state,
        quests: [
          ...state.quests.slice(0, questIdx),
          convertQuest(embarkedQuests[0]),
          ...state.quests.slice(questIdx + 1),
        ],
        heroes: upHeroes,
        chosenQuest: null,
        heroesAssignedToQuest: [],
      };

    case "COLLECTING_QUEST_REWARD":
      return {
        ...state,
        collectingQuestReward: action.payload,
      };

    case "COMPLETE_QUEST":
      const { stats, quest, heroes } = action.payload;

      const completeQuestIdx = state.quests.findIndex((q) => q.id === quest.id);

      let doneHeroes = [...state.heroes];
      for (let i = 0; i < heroes.length; i++) {
        const hero = convertHero(heroes[i]);
        const heroIdx = doneHeroes.findIndex((h) => h.id === hero.id);
        doneHeroes = [
          ...doneHeroes.slice(0, heroIdx),
          hero,
          ...doneHeroes.slice(heroIdx + 1),
        ];
      }

      return {
        ...state,
        gold: stats.gold,
        fame: stats.fame,
        quests: [
          ...state.quests.slice(0, completeQuestIdx),
          ...state.quests.slice(completeQuestIdx + 1),
        ],
        heroes: doneHeroes,
        collectingQuestReward: null,
      };

    default:
      return state;
  }
};

export default reducer;
