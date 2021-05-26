import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose, Dispatch } from "redux";
import { fetchGameStats } from "../../actions/ApiActions";
import AuthContext, { AuthProps } from "../../contexts/AuthContext";
import withApiService from "../../hoc/WithApiService";
import { useDisplayMessage } from "../../hooks/UseDisplayMessages";
import GameStats from "../../models/GameStats";
import ApiService from "../../services/ApiService";
import "./header.scss";

type HeaderProps = {
  gold: number;
  fame: number;
  fetchGameStats: (auth: AuthProps) => void;
  isAuthenticated: boolean;
  logout: () => void;
};

const Header = ({
  gold,
  fame,
  fetchGameStats,
  isAuthenticated,
  logout,
}: HeaderProps) => {
  const displayMessage = useDisplayMessage();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.userId) {
      fetchGameStats(authContext);
    }
  }, [fetchGameStats, authContext]);

  const onLogout = () => {
    displayMessage(`До скорой встречи!`);
    logout();
  };

  const headerBar = (
    <React.Fragment>
      <div className="header__resources">
        <div className="header__resources-fame--img"></div>
        <div className="header__resources-fame">Слава: {fame}</div>
        <div className="header__resources-gold--img"></div>
        <div className="header__resources-gold">Золото: {gold}</div>
      </div>
      <button className="header__btn-logout" onClick={onLogout}>
        LOGOUT
      </button>
    </React.Fragment>
  );

  return (
    <header className="header">
      <div className="header__title">Some Adventure Game</div>
      {isAuthenticated ? headerBar : null}
    </header>
  );
};

const mapStateToProps = ({ gold, fame }: GameStats) => {
  return { gold, fame };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  customProps: { apiService: ApiService }
) => {
  const { apiService } = customProps;
  return bindActionCreators(
    { fetchGameStats: fetchGameStats(apiService) },
    dispatch
  );
};

export default compose(
  withApiService(),
  connect(mapStateToProps, mapDispatchToProps)
)(Header);
