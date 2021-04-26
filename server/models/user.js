import usePool from "./use-pool.js";

class User {
  constructor(id, login, password) {
    this.id = id;
    this.login = login;
    this.password = password;
  }
}

const saveUser = (user) => {
  return new Promise((resolve, reject) => {
    const { login, password } = user;
    usePool(
      "insert into public.user (login, password) values ($1, $2)",
      [login, password],
      (error, result) => {
        if (error) {
          reject(error);
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
          return reject(error);
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

export { User, saveUser, getUser };
