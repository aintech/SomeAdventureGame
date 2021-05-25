import { Switch, Route, Redirect } from "react-router-dom";
import GameplayPage from "./pages/gameplay-page/GameplayPage";
import WelcomePage from "./pages/welcome-page/WelcomePage";

export const useRoutes = (isAuthenticated: boolean) => {
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/welcome" exact>
          <WelcomePage />
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
      <Redirect to="/welcome" />
    </Switch>
  );
};
