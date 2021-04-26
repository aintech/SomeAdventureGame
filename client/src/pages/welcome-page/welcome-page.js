import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../contexts/auth-context";
import AuthService from "../../services/auth-service";
import "./welcome-page.scss";

const WelcomePage = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const authService = new AuthService();
  let disableBtns = false;

  const [form, setForm] = useState({ login: "", password: "" });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      await authService.request("/api/auth/register", "POST", { ...form });
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await authService.request("/api/auth/login", "POST", {
        ...form,
      });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  const gotoGameplay = () => {
    history.push("gameplay");
  };

  const loginForm = (
    <div className="login__form">
      <form>
        <input
          className="login__form--input"
          placeholder="Login"
          name="login"
          value={form.login}
          onChange={changeHandler}
          required
        />
        <input
          className="login__form--input"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={changeHandler}
          required
        />
        <button
          className="login__form--btn"
          type="button"
          onClick={registerHandler}
        >
          REGISTER
        </button>
        <button
          className="login__form--btn"
          type="button"
          onClick={loginHandler}
        >
          LOGIN
        </button>
      </form>
    </div>
  );

  return (
    <div className="welcome">
      {auth.isAuthenticated ? (
        <button className="btn-continue" onClick={gotoGameplay}>
          Continue Play
        </button>
      ) : (
        loginForm
      )}
    </div>
  );
};

export default WelcomePage;
