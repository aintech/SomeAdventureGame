import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/header/header";
import Loader from "./components/loader/loader";
import { ApiServiceProvider } from "./contexts/api-service-context";
import AuthContext from "./contexts/auth-context";
import useAuth from "./hooks/use-auth";
import { useRoutes } from "./routes";
import ApiService from "./services/api-service";
import store from "./store";

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
        value={{ token, login, logout, userId, isAuthenticated }}
      >
        <ApiServiceProvider value={apiService}>
          <BrowserRouter>
            <main>
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
