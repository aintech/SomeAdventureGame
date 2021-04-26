import { useCallback, useEffect, useState } from "react";

const storageName = "someAdventureGameUserData";
const storageLifetime = 60 * 60 * 1000;

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
        time: new Date().getTime(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  const isFreshLogin = (loginTime) => {
    return loginTime + storageLifetime > new Date().getTime();
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.token && isFreshLogin(data.time)) {
      login(data.token, data.userId);
    } else {
      logout();
    }
    setReady(true);
  }, [login, logout]);

  return { login, logout, token, userId, ready };
};

export default useAuth;
