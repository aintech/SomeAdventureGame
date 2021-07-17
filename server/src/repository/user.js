import query, { single } from "./db.js";
import { createStats } from "./stats.js";

const createUser = async (user) => {
  await _persistUser(user);

  const persisted = await getUser(user.login);

  await createStats(persisted.id);

  return Promise.resolve(persisted);
};

const _persistUser = async (user) => {
  const { login, password } = user;
  return query(
    "persistUser",
    "insert into public.user (login, password) values ($1, $2)",
    [login, password]
  );
};

const getUser = (login) => {
  return query(
    "getUser",
    "select * from public.user where login = $1",
    [login],
    single
  );
};

export { createUser, getUser };
