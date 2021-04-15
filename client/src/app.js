import React from "react";

import Header from "./components/header/header";
import { useRoutes } from "./routes";

const App = () => {
  const routes = useRoutes();

  return (
    <main>
      <Header />
      {routes}
    </main>
  );
};

export default App;
