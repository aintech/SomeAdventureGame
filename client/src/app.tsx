import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/header/Header";
import Loader from "./components/loader/Loader";
import MessagePopupContainer from "./components/message-popup/MessagePopupContainer";
import { ApiServiceProvider } from "./contexts/ApiServiceContext";
import AuthContext from "./contexts/AuthContext";
import useAuth from "./hooks/UseAuth";
import { useRoutes } from "./Routes";
import ApiService from "./services/ApiService";
import store from "./Store";
import "./app.scss";

const App = () => {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  const apiService = new ApiService();

  if (!ready) {
    return <Loader message={"App is preparing..."} />;
  }

  return (
    <Provider store={store}>
      <AuthContext.Provider
        value={{
          token,
          login,
          logout,
          userId,
          isAuthenticated,
        }}
      >
        <ApiServiceProvider value={apiService}>
          <BrowserRouter>
            <main className="app-main">
              <MessagePopupContainer messages={[]} />
              <Header isAuthenticated={isAuthenticated} logout={logout} />
              {routes}
            </main>
          </BrowserRouter>
        </ApiServiceProvider>
      </AuthContext.Provider>
    </Provider>
  );
};

export default App;
