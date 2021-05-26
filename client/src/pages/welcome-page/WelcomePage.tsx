import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import AuthContext from "../../contexts/AuthContext";
import { useDisplayMessage } from "../../hooks/UseDisplayMessages";
import LoginForm from "../../models/LoginForm";
import { login, register } from "../../services/AuthService";
import "./welcome-page.scss";

/**
 * TODO: При успешной регистрации сразу логиниться
 * TODO: После нажатия кнопок регистрации или логина дизейблить их
 * TODO: Выводить сообщения об удачной регистрации и логине
 */

const WelcomePage = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const displayMessage = useDisplayMessage();

  const [form, setForm] = useState<LoginForm>({ login: "", password: "" });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      await register({ ...form });
    } catch (e) {}
  };

  const loginHandler = async (
    event:
      | React.KeyboardEvent<HTMLDivElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => {
    const btnPressed = event.currentTarget.id === "login_btn";

    const enterPressed =
      "code" in event &&
      (event.code === "Enter" || event.code === "NumpadEnter");

    if (btnPressed || enterPressed) {
      try {
        const data = await login({ ...form });
        auth.login(data.token!, data.userId!);
        displayMessage(`Добро пожаловать!`);
      } catch (e) {}
    }
  };

  const gotoGameplay = () => {
    history.push("gameplay");
  };

  const loginForm = (
    <div className="login__form" onKeyPress={loginHandler}>
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
          id="login_btn"
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
