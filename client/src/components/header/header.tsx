import React, { useContext, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { fetchGameStats } from "../../actions/ApiActions";
import AuthContext from "../../contexts/auth-context";
import withApiService from "../../hoc/with-api-service";
import ApiService from "../../services/api-service";
import "./header.scss";

type HeaderProps = {
  gold: number;
  fame: number;
  fetchGameStats: (apiService: any) => (auth: any) => (dispatch: any) => void;
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
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.userId) {
      fetchGameStats(authContext);
    }
  });

  const headerBar = (
    <React.Fragment>
      <div className="header__resources">
        <div className="header__resources-fame--img"></div>
        <div className="header__resources-fame">Слава: {fame}</div>
        <div className="header__resources-gold--img"></div>
        <div className="header__resources-gold">Золото: {gold}</div>
      </div>
      <button className="header__btn-logout" onClick={logout}>
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

const mapStateToProps = ({ gold, fame }: { gold: number; fame: number }) => {
  return { gold, fame };
};

const mapDispatchToProps = (
  dispatch: any,
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
