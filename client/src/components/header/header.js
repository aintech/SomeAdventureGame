import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { fetchGameStats } from "../../actions/actions.js";
import withApiService from "../../hoc/with-api-service.js";
import "./header.scss";

const Header = ({ gold, fame, fetchGameStats, isAuthenticated, logout }) => {
  useEffect(() => {
    fetchGameStats();
  });

  const logoutBtn = (
    <button className="header__btn-logout" onClick={logout}>
      LOGOUT
    </button>
  );

  return (
    <header className="header">
      <div className="header__title">Some Adventure Game</div>
      <div className="header__resources">
        <div className="header__resources-fame--img"></div>
        <div className="header__resources-fame">Слава: {fame}</div>
        <div className="header__resources-gold--img"></div>
        <div className="header__resources-gold">Золото: {gold}</div>
        {isAuthenticated ? logoutBtn : null}
      </div>
    </header>
  );
};

const mapStateToProps = ({ gold, fame }) => {
  return { gold, fame };
};

const mapDispatchToProps = (dispatch, customProps) => {
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
