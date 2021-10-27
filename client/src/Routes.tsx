import { Switch, Route, Redirect } from "react-router-dom";
import GameplayPage from "./pages/gameplay-page/GameplayPage";
import WelcomePage from "./pages/welcome-page/WelcomePage";
import WikiPage from "./pages/wiki-page/WikiPage";

export const useRoutes = (isAuthenticated: boolean) => {
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/welcome" exact>
          <WelcomePage />
        </Route>
        <Route path="/wiki" exact>
          <WikiPage />
        </Route>
        <Redirect to="/welcome" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/welcome" exact>
        <WelcomePage />
      </Route>
      <Route path="/gameplay" exact>
        <GameplayPage />
      </Route>
      <Route path="/wiki" exact>
        <WikiPage />
      </Route>
      <Redirect to="/welcome" />
    </Switch>
  );
};
