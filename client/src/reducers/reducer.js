const intialState = {
  buildings: [],
  loading: true,
  buildingClicked: null,
};

const reducer = (state = intialState, action) => {
  switch (action.type) {
    case "FETCH_BUILDINGS_REQUEST":
      return {
        buildings: [],
        loading: true,
      };

    case "FETCH_BUILDINGS_SUCCESS":
      return {
        buildings: action.payload,
        loading: false,
      };

    case "BUILDING_CLICKED":
      console.log(action.payload);
      return {
        ...state,
        buildingClicked: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
