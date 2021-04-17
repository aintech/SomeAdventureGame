const intialState = {
  buildings: [],
  quests: [],
  heroes: [],
  chosenBuilding: null,
  chosenQuest: null,
  heroesAssignedToQuest: [],
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
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
        heroes: action.payload,
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

    default:
      return state;
  }
};

export default reducer;
