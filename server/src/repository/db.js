import pg from "pg";

const pool = new pg.Pool({
  user: "yaremchuken",
  host: "localhost",
  database: "adventure",
  password: "admin",
  port: 5432,
});

export const single = (val) => {
  return val ? (val.length > 0 ? val[0] : null) : null;
};

const query = (logName, sql, params = [], wrapper) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        return reject(new Error(`${logName} ${error}`));
      }
      resolve(wrapper ? wrapper(result.rows) : result.rows);
    });
  });
};

export default query;
