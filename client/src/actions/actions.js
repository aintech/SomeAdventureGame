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

const fetchBuildings = (apiService) => () => (dispatch) => {
  dispatch(buildingsRequested());
  apiService.getBuildings().then((data) => dispatch(buildingsLoaded(data)));
};

export { fetchBuildings, buildingClicked };
