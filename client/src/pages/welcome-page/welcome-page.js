import React from "react";
import { useHistory } from "react-router";

import "./welcome-page.scss";

const WelcomePage = () => {
  const history = useHistory();

  const gotoGameplay = () => {
    history.push("gameplay");
  };

  return (
    <div className="welcome">
      <div className="welcome__greeting">Welcome</div>
      <div className="welcome__btn-holder">
        <button className="btn-start" onClick={gotoGameplay}>
          Lets begin
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
