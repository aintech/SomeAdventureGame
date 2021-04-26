import pg from "pg";

const pool = new pg.Pool({
  user: "yaremchuken",
  host: "localhost",
  database: "adventure",
  password: "admin",
  port: 5432,
});

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
    pool.query(
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
    pool.query(
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
