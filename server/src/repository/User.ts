import { LoginUser } from "../routes/AuthRoutes";
import { initiateBuildings } from "./Building";
import query, { single } from "./Db";
import { initiateStats } from "./Stats";

type User = {
  id: number;
  login: string;
  password: string;
};

//FIXME: Добавить первоначальный ассортимент на рынок и алхимику
export const createUser = async (user: LoginUser) => {
  await persistUser(user);

  const persisted = await getUser(user.login);

  await initiateStats(persisted.id);
  await initiateBuildings(persisted.id);

  return Promise.resolve(persisted);
};

const persistUser = async (user: LoginUser) => {
  const { login, password } = user;
  return query<void>("persistUser", "insert into public.user (login, password) values ($1, $2)", [login, password]);
};

export const getUser = (login: string) => {
  return query<User>("getUser", "select * from public.user where login = $1", [login], mapUser, single);
};

type UserRow = {
  id: string;
  login: string;
  password: string;
};

const mapUser = (row: UserRow) => {
  return {
    id: +row.id,
    login: row.login,
    password: row.password,
  };
};
