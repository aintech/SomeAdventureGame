import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./app";

import "./index.scss";

import { ApiServiceProvider } from "./services-context/api-service-context";
import ApiService from "./services/api-service";
import store from "./store.js";

const apiService = new ApiService();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ApiServiceProvider value={apiService}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ApiServiceProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
