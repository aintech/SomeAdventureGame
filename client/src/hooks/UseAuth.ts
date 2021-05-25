import { useCallback, useEffect, useState } from "react";

const storageName = "someAdventureGameUserData";
const storageLifetime = 24 * 60 * 60 * 1000;

type StoredUserData = {
  token: string;
  userId: number;
  time: number;
};

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  const login = useCallback((jwtToken: string, id: number) => {
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

  const isFreshLogin = (loginTime: number): boolean => {
    return loginTime + storageLifetime > new Date().getTime();
  };

  useEffect(() => {
    const data: StoredUserData = JSON.parse(
      localStorage.getItem(storageName) as string
    );
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
