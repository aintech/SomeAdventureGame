import { createStats } from "./stats.js";
import usePool from "./use-pool.js";

const createUser = async (user) => {
  await _persistUser(user);

  const persisted = await getUser(user.login);

  await createStats(persisted.id);

  return Promise.resolve(persisted);
};

const _persistUser = async (user) => {
  return new Promise((resolve, reject) => {
    const { login, password } = user;
    usePool(
      "insert into public.user (login, password) values ($1, $2)",
      [login, password],
      (error, result) => {
        if (error) {
          return reject(new Error(`persistUser ${error}`));
        }
        resolve(result.rows[0]);
      }
    );
  });
};

const getUser = (login) => {
  return new Promise((resolve, reject) => {
    usePool(
      "select * from public.user where login = $1",
      [login],
      (error, result) => {
        if (error) {
          return reject(new Error(`getUser ${error}`));
        }
        if (!result) {
          return resolve(null);
        }
        if (result.rowCount === 0) {
          return resolve(null);
        }
        resolve(result.rows[0]);
      }
    );
  });
};

export { createUser, getUser };
