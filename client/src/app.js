import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import Header from "./components/header/header";
import { useRoutes } from "./routes";
import store from "./store.js";

const App = () => {
  const routes = useRoutes();

  return (
    <Provider store={store}>
      <Header />
      <BrowserRouter>{routes}</BrowserRouter>
    </Provider>
  );
};

export default App;
