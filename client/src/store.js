import { applyMiddleware, createStore } from "redux";
import thunkMiddlewate from "redux-thunk";

import reducer from "./reducers/reducer";

const store = createStore(reducer, applyMiddleware(thunkMiddlewate));

export default store;
