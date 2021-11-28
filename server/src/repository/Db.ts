import pg from "pg";
import config from "config";

const pool = new pg.Pool({
  user: config.get("dbUser"),
  host: config.get("dbHost"),
  database: config.get("dbName"),
  password: config.get("dbPass"),
  port: config.get("dbPort"),
});

export const single = <T>(val: T[]) => {
  return val ? (val.length > 0 ? val[0] : null) : null;
};

export const defaultMapper = (row: any) => {
  return row;
};

const defaultWrapper = (wrapped: any) => {
  return wrapped;
};

const query = <T>(
  logName: string,
  sql: string,
  params: any[] = [],
  mapper: (row: any) => any = defaultMapper,
  wrapper: (wrapped: any[]) => any = defaultWrapper
): Promise<T> => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        return reject(new Error(`${logName} ${error}`));
      }
      resolve(wrapper(mapRows(result.rows, mapper)));
    });
  });
};

const mapRows = (rows: any[], mapper: (row: any) => any): any[] => {
  if (rows === null) {
    return [];
  }
  return rows.map((r) => mapper(r));
};

export default query;
