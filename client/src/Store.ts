import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import reducer from "./reducers/Reducer";

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default store;
