import { PayloadedAction } from '../actions/Actions';
import { ActionType } from '../actions/ActionType';
import { ConfirmDialogType } from '../components/confirm-dialog/ConfirmDialog';
import { Tooltip } from '../components/gameplay-tooltip/GameplayTooltip';
import { QuestPerformData } from '../components/gameplay/quest-perform/QuestPerform';
import { Message } from '../components/message-popup/MessagePopup';
import Building from '../models/Building';
import Equipment, { convert as convertEquipment } from '../models/Equipment';
import GameStats from '../models/GameStats';
import Hero, { convert as convertHero } from '../models/hero/Hero';
import Item, { convertItem } from '../models/Item';
import Quest, { convert as convertQuest } from '../models/Quest';
import { CheckpointReward } from '../models/QuestCheckpoint';
import { EquipmentResponse, HeroResponse, HireHeroResponse, ItemResponse } from '../services/HeroService';
import { QuestResponse } from '../services/QuestService';
import { remove, replace } from '../utils/arrays';

export type State = {
  stats: GameStats;
  quests: Quest[];
  heroes: Hero[];
  buildings: Building[];
  tavernPatrons: Hero[];
  marketAssortment: Equipment[];
  alchemistAssortment: Item[];
  chosenBuilding?: Building;
  chosenHero?: Hero;
  messages: Message[];
  tooltip: Tooltip;
  confirmDialog?: ConfirmDialogType;
  activeQuestPerform?: QuestPerformData;
  checkpointReward?: CheckpointReward;
};

const intialState = {
  stats: { gold: 0, fame: 0 },
  quests: [],
  heroes: [],
  buildings: [],
  tavernPatrons: [],
  marketAssortment: [],
  alchemistAssortment: [],
  messages: [],
  tooltip: { message: '', appear: false },
};

const reducer = (state: State = intialState, action: PayloadedAction) => {
  let chosenHero = state.chosenHero;
  let chosenBuilding = state.chosenBuilding;

  switch (action.type) {
    case ActionType.LOGOUT:
      return {
        ...intialState,
      };

    case ActionType.FETCH_GAME_STATS_REQUEST:
      return {
        ...state,
        stats: { gold: 0, fame: 0 },
      };

    case ActionType.FETCH_GAME_STATS_SUCCESS:
      return {
        ...state,
        stats: { ...action.payload },
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
        heroes: action.payload
          .map((h: HeroResponse) => convertHero(h))
          .sort((a: Hero, b: Hero) => {
            return a.id - b.id;
          }),
      };

    case ActionType.FETCH_BUILDINGS_REQUEST:
      return {
        ...state,
        buildings: [],
      };

    case ActionType.FETCH_BUILDINGS_SUCCESS:
      return {
        ...state,
        buildings: action.payload,
      };

    case ActionType.FETCH_TAVERN_PATRONS_REQUEST:
      return {
        ...state,
        tavernPatrons: [],
      };

    case ActionType.FETCH_TAVERN_PATRONS_SUCCESS:
      return {
        ...state,
        tavernPatrons: action.payload
          .map((h: HeroResponse) => convertHero(h))
          .sort((a: Hero, b: Hero) => {
            return a.id - b.id;
          }),
      };

    case ActionType.FETCH_MARKET_ASSORTMENT_REQUEST:
      return {
        ...state,
        marketAssortment: [],
      };

    case ActionType.FETCH_MARKET_ASSORTMENT_SUCCESS:
      return {
        ...state,
        marketAssortment: action.payload.map((e: EquipmentResponse) => convertEquipment(e)),
      };

    case ActionType.FETCH_ALCHEMIST_ASSORTMENT_REQUEST:
      return {
        ...state,
        alchemistAssortment: [],
      };

    case ActionType.FETCH_ALCHEMIST_ASSORTMENT_SUCCESS:
      return {
        ...state,
        alchemistAssortment: action.payload.map((e: ItemResponse) => convertItem(e)),
      };

    case ActionType.BUILDING_CLICKED:
      return {
        ...state,
        chosenBuilding: action.payload,
      };

    case ActionType.HERO_STATS_CHOOSED:
      return {
        ...state,
        chosenHero: action.payload,
      };

    case ActionType.HERO_STATS_DISPLAY_CLOSED:
      return {
        ...state,
        chosenHero: undefined,
      };

    case ActionType.HEROES_EMBARKED_ON_QUEST:
      const { embarkedQuest, embarkedHeroes } = action.payload;

      const questIdx = state.quests.findIndex((q) => q.id === +embarkedQuest.id);

      let upHeroes = [...state.heroes];
      for (const embHero of embarkedHeroes) {
        const hero = convertHero(embHero);
        const heroIdx = upHeroes.findIndex((h) => h.id === hero.id);
        upHeroes = [...upHeroes.slice(0, heroIdx), hero, ...upHeroes.slice(heroIdx + 1)];
        if (chosenHero) {
          if (hero.id === chosenHero.id) {
            chosenHero = hero;
          }
        }
      }

      return {
        ...state,
        quests: [...state.quests.slice(0, questIdx), convertQuest(embarkedQuest), ...state.quests.slice(questIdx + 1)],
        heroes: upHeroes,
        chosenHero,
        chosenQuest: undefined,
        heroesAssignedToQuest: [],
      };

    case ActionType.CHECKPOINT_PASSED:
      const embQuest = action.payload.quest as QuestResponse;
      const embHeroes = action.payload.heroes as HeroResponse[];
      const checkpointReward = action.payload.reward as CheckpointReward;

      const qIdx = state.quests.findIndex((q) => q.id === +embQuest.id);

      let uHeroes = [...state.heroes];
      for (const embHero of embHeroes) {
        const hero = convertHero(embHero);
        const heroIdx = uHeroes.findIndex((h) => h.id === hero.id);
        uHeroes = [...uHeroes.slice(0, heroIdx), hero, ...uHeroes.slice(heroIdx + 1)];
        if (chosenHero) {
          if (hero.id === chosenHero.id) {
            chosenHero = hero;
          }
        }
      }
      return {
        ...state,
        quests: [...state.quests.slice(0, qIdx), convertQuest(embQuest), ...state.quests.slice(qIdx + 1)],
        heroes: uHeroes,
        chosenHero,
        activeQuestPerform: {
          quest: convertQuest(embQuest),
          heroes: embHeroes
            .map((h) => convertHero(h))
            .sort((a: Hero, b: Hero) => {
              return a.id - b.id;
            }),
        },
        checkpointReward,
      };

    case ActionType.CLEAR_CHECKPOINT_REWARD:
      return {
        ...state,
        checkpointReward: undefined,
      };

    case ActionType.COMPLETE_QUEST:
    case ActionType.CANCEL_QUEST:
      const { stats, quest, heroes } = action.payload;

      let changeHeroes = [...state.heroes];
      for (const hr of heroes) {
        changeHeroes = replace(changeHeroes, convertHero(hr));
        if (chosenHero) {
          if (hr.id === chosenHero.id) {
            chosenHero = convertHero(hr);
          }
        }
      }

      let changeQuest = quest.completed ? remove(state.quests, convertQuest(quest)) : replace(state.quests, convertQuest(quest));

      return {
        ...state,
        stats,
        quests: changeQuest,
        heroes: changeHeroes,
        chosenHero,
        activeQuestPerform: undefined,
      };

    case ActionType.SHOW_USER_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case ActionType.DISMISS_USER_MESSAGE:
      const messageIdx = state.messages.findIndex((m) => m.id === action.payload);

      return {
        ...state,
        messages: [...state.messages.slice(0, messageIdx), ...state.messages.slice(messageIdx + 1)],
      };

    case ActionType.HERO_HIRED:
      const hireResult = action.payload as HireHeroResponse;
      const hero: Hero = convertHero(hireResult.hired);
      const patronIdx = state.tavernPatrons.findIndex((p) => p.id === hero.id);

      return {
        ...state,
        stats: hireResult.stats,
        heroes: [...state.heroes, hero],
        tavernPatrons: [...state.tavernPatrons.slice(0, patronIdx), ...state.tavernPatrons.slice(patronIdx + 1)],
      };

    case ActionType.HERO_DISMISSED:
      const heroIdx = state.heroes.findIndex((h) => +h.id === +action.payload);
      return {
        ...state,
        heroes: [...state.heroes.slice(0, heroIdx), ...state.heroes.slice(heroIdx + 1)],
      };

    case ActionType.HERO_ACTIVITIES_UPDATED:
      const occupHeroes = action.payload as HeroResponse[];

      let replacedHeroes = [...state.heroes];
      for (const hr of occupHeroes) {
        const hero = convertHero(hr);
        const heroIdx = replacedHeroes.findIndex((h) => h.id === hero.id);
        replacedHeroes = [...replacedHeroes.slice(0, heroIdx), hero, ...replacedHeroes.slice(heroIdx + 1)];
        if (chosenHero) {
          if (hero.id === chosenHero.id) {
            chosenHero = hero;
          }
        }
      }
      return {
        ...state,
        heroes: replacedHeroes,
        chosenHero,
      };

    case ActionType.SHOW_TOOLTIP:
      const tooltip = action.payload as Tooltip;
      const message = tooltip.appear ? tooltip.message : state.tooltip.message;
      return {
        ...state,
        tooltip: {
          message,
          appear: tooltip.appear,
        },
      };

    case ActionType.SHOW_CONFIRM_DIALOG:
      return {
        ...state,
        confirmDialog: action.payload,
      };

    case ActionType.BEGIN_QUEST_PROCESS:
      return {
        ...state,
        activeQuestPerform: action.payload,
      };

    case ActionType.CLOSE_QUEST_PROCESS:
      return {
        ...state,
        activeQuestPerform: undefined,
      };

    case ActionType.BUILDING_UPGRADE_STARTED:
      const data: { stats: GameStats; buildings: Building[] } = action.payload;
      chosenBuilding = undefined;

      if (state.chosenBuilding) {
        chosenBuilding = data.buildings.find((b) => b.type === state.chosenBuilding!.type)!;
      }

      return {
        ...state,
        stats: data.stats,
        buildings: data.buildings,
        chosenBuilding,
      };

    case ActionType.BUILDING_UPGRADE_COMPLETED:
      const buildings: Building[] = action.payload;
      chosenBuilding = undefined;

      if (state.chosenBuilding) {
        chosenBuilding = buildings.find((b) => b.type === state.chosenBuilding!.type)!;
      }

      return {
        ...state,
        buildings: buildings,
        chosenBuilding,
      };

    default:
      return state;
  }
};

export default reducer;
