import { Action } from "../actions/Actions";
import { ActionType } from "../actions/ActionType";
import Building from "../models/Building";
import Hero, { convert as convertHero } from "../models/Hero";
import Quest, { convert as convertQuest } from "../models/Quest";
import { HeroResponse } from "../services/HeroesService";
import { QuestResponse } from "../services/QuestsService";

type State = {
  gold: number;
  fame: number;
  quests: Quest[];
  heroes: Hero[];
  chosenBuilding: Building | null;
  chosenQuest: Quest | null;
  chosenHero: Hero | null;
  heroesAssignedToQuest: Hero[];
  collectingQuestReward: Quest | null;
};

const intialState = {
  gold: 0,
  fame: 0,
  quests: [],
  heroes: [],
  chosenBuilding: null,
  chosenQuest: null,
  chosenHero: null,
  heroesAssignedToQuest: [],
  collectingQuestReward: null,
};

const reducer = (state: State = intialState, action: Action) => {
  switch (action.type) {
    case ActionType.FETCH_GAME_STATS_REQUEST:
      return {
        ...state,
        gold: 0,
        fame: 0,
      };

    case ActionType.FETCH_GAME_STATS_SUCCESS:
      return {
        ...state,
        gold: action.payload.gold,
        fame: action.payload.fame,
      };

    case ActionType.FETCH_QUESTS_REQUEST:
      return {
        ...state,
        quests: [],
      };

    case ActionType.FETCH_QUESTS_SUCCESS:
      return {
        ...state,
        quests: action.payload.map((q: QuestResponse) => convertQuest(q)),
      };

    case ActionType.FETCH_HEROES_REQUEST:
      return {
        ...state,
        heroes: [],
      };

    case ActionType.FETCH_HEROES_SUCCESS:
      return {
        ...state,
        heroes: action.payload.map((h: HeroResponse) => convertHero(h)),
      };

    case ActionType.BUILDING_CLICKED:
      return {
        ...state,
        chosenBuilding: action.payload,
      };

    case ActionType.QUEST_SCROLL_CHOOSED:
      return {
        ...state,
        chosenQuest: action.payload,
      };

    case ActionType.QUEST_SCROLL_CLOSED:
      return {
        ...state,
        chosenQuest: null,
        heroesAssignedToQuest: [],
      };

    case ActionType.HERO_STATS_CHOOSED:
      return {
        ...state,
        chosenHero: action.payload,
      };

    case ActionType.HERO_STATS_CLOSED:
      return {
        ...state,
        chosenHero: null,
      };

    case ActionType.HERO_ASSIGNED_TO_QUEST:
      return {
        ...state,
        heroesAssignedToQuest: [...state.heroesAssignedToQuest, action.payload],
      };

    case ActionType.HERO_DISMISSED_FROM_QUEST:
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

    case ActionType.HEROES_EMBARKED_ON_QUEST:
      const { embarkedQuests, embarkedHeroes } = action.payload;

      const questIdx = state.quests.findIndex(
        (q) => q.id === embarkedQuests[0].id
      );

      let upHeroes = [...state.heroes];
      for (const embHero of embarkedHeroes) {
        const hero = convertHero(embHero);
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

    case ActionType.COLLECTING_QUEST_REWARD:
      return {
        ...state,
        collectingQuestReward: action.payload,
      };

    case ActionType.COMPLETE_QUEST:
      const { stats, quest, heroes } = action.payload;

      const completeQuestIdx = state.quests.findIndex((q) => q.id === quest.id);

      let doneHeroes = [...state.heroes];
      for (const hr of heroes) {
        const hero = convertHero(hr);
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
