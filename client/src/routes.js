import { Switch, Route, Redirect } from "react-router-dom";
import GameplayPage from "./pages/gameplay-page/gameplay-page";
import WelcomePage from "./pages/welcome-page/welcome-page";

export const useRoutes = () => {
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
