import pg from "pg";
// import pgp from "pg-promise";

const pool = new pg.Pool({
  user: "yaremchuken",
  host: "localhost",
  database: "adventure",
  password: "admin",
  port: 5432,
});

const usePool = (sql, params, callback) => {
  pool.query(sql, [...params], callback);
};

export default usePool;
