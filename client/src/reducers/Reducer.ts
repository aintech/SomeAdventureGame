import { PayloadedAction } from "../actions/Actions";
import { ActionType } from "../actions/ActionType";
import { Message } from "../components/message-popup/MessagePopup";
import Building from "../models/Building";
import Hero, { convert as convertHero } from "../models/hero/Hero";
import Quest, { convert as convertQuest } from "../models/Quest";
import { HeroResponse, HireHeroResponse } from "../services/HeroesService";
import { QuestResponse } from "../services/QuestsService";

export type State = {
  gold: number;
  fame: number;
  quests: Quest[];
  heroes: Hero[];
  tavernPatrons: Hero[];
  chosenBuilding: Building | null;
  chosenQuest: Quest | null;
  chosenHero: Hero | null;
  heroesAssignedToQuest: Hero[];
  collectingQuestReward: Quest | null;
  messages: Message[];
};

const intialState = {
  gold: 0,
  fame: 0,
  quests: [],
  heroes: [],
  tavernPatrons: [],
  chosenBuilding: null,
  chosenQuest: null,
  chosenHero: null,
  heroesAssignedToQuest: [],
  collectingQuestReward: null,
  messages: [],
};

const reducer = (state: State = intialState, action: PayloadedAction) => {
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

    case ActionType.FETCH_TAVERN_PATRONS_REQUEST:
      return {
        ...state,
        tavernPatrons: [],
      };

    case ActionType.FETCH_TAVERN_PATRONS_SUCCESS:
      return {
        ...state,
        tavernPatrons: action.payload.map((h: HeroResponse) => convertHero(h)),
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

    case ActionType.HERO_STATS_DISPLAY_CLOSED:
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
        (q) => q.id === +embarkedQuests[0].id
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

    case ActionType.CHECKPOINT_PASSED:
      const embQuest = action.payload.quest;
      const embHeroes = action.payload.heroes;

      const qIdx = state.quests.findIndex((q) => q.id === +embQuest.id);

      let uHeroes = [...state.heroes];
      for (const embHero of embHeroes) {
        const hero = convertHero(embHero);
        const heroIdx = uHeroes.findIndex((h) => h.id === hero.id);
        uHeroes = [
          ...uHeroes.slice(0, heroIdx),
          hero,
          ...uHeroes.slice(heroIdx + 1),
        ];
      }
      return {
        ...state,
        quests: [
          ...state.quests.slice(0, qIdx),
          convertQuest(embQuest),
          ...state.quests.slice(qIdx + 1),
        ],
        heroes: uHeroes,
      };

    case ActionType.COLLECTING_QUEST_REWARD:
      return {
        ...state,
        collectingQuestReward: action.payload,
      };

    case ActionType.COMPLETE_QUEST:
      const { stats, quest, heroes } = action.payload;

      const completeQuestIdx = state.quests.findIndex(
        (q) => q.id === +quest.id
      );

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

    case ActionType.SHOW_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case ActionType.DISMISS_USER_MESSAGE:
      const messageIdx = state.messages.findIndex(
        (m) => m.id === action.payload
      );

      return {
        ...state,
        messages: [
          ...state.messages.slice(0, messageIdx),
          ...state.messages.slice(messageIdx + 1),
        ],
      };

    case ActionType.HERO_HIRED:
      const hireResult = action.payload as HireHeroResponse;
      const hero: Hero = convertHero(hireResult.hired);
      const patronIdx = state.tavernPatrons.findIndex((p) => p.id === hero.id);

      return {
        ...state,
        gold: hireResult.stats.gold,
        fame: hireResult.stats.fame,
        heroes: [...state.heroes, hero],
        tavernPatrons: [
          ...state.tavernPatrons.slice(0, patronIdx),
          ...state.tavernPatrons.slice(patronIdx + 1),
        ],
      };

    case ActionType.HERO_ACTIVITIES_UPDATED:
      const occupHeroes = action.payload as HeroResponse[];

      let replacedHeroes = [...state.heroes];
      for (const hr of occupHeroes) {
        const hero = convertHero(hr);
        const heroIdx = replacedHeroes.findIndex((h) => h.id === hero.id);
        replacedHeroes = [
          ...replacedHeroes.slice(0, heroIdx),
          hero,
          ...replacedHeroes.slice(heroIdx + 1),
        ];
      }
      return {
        ...state,
        heroes: replacedHeroes,
      };

    default:
      return state;
  }
};

export default reducer;
