import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { fetchGameStats } from "../../actions/ApiActions";
import AuthContext from "../../contexts/AuthContext";
import withApiService, { WithApiServiceProps } from "../../hoc/WithApiService";
import { useDisplayMessage } from "../../hooks/UseDisplayMessages";
import GameStats from "../../models/GameStats";
import "./header.scss";

type HeaderProps = {
  stats: GameStats;
  fetchGameStats: () => void;
  isAuthenticated: boolean;
  logout: () => void;
};

const Header = ({
  stats,
  fetchGameStats,
  isAuthenticated,
  logout,
}: HeaderProps) => {
  const displayMessage = useDisplayMessage();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.userId) {
      fetchGameStats();
    }
  }, [fetchGameStats, authContext]);

  const onLogout = () => {
    displayMessage(`До скорой встречи!`);
    logout();
  };

  const headerBar = (
    <>
      <div className="header__resources">
        <div className="header__resources-fame--img"></div>
        <div className="header__resources-fame">Слава: {stats.fame}</div>
        <div className="header__resources-gold--img"></div>
        <div className="header__resources-gold">Золото: {stats.gold}</div>
      </div>
      <button className="header__btn-logout" onClick={onLogout}>
        LOGOUT
      </button>
    </>
  );

  return (
    <header className="header">
      <div className="header__title">Some Adventure Game</div>
      {isAuthenticated ? headerBar : null}
    </header>
  );
};

type HeaderState = {
  stats: GameStats;
};

const mapStateToProps = ({ stats }: HeaderState) => {
  return { stats };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: WithApiServiceProps
) => {
  const { apiService, auth } = customProps;
  return bindActionCreators(
    { fetchGameStats: fetchGameStats(apiService, auth) },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(Header);
