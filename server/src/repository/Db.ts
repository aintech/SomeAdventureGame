import pg from "pg";

const pool = new pg.Pool({
  user: "yaremchuken",
  host: "localhost",
  database: "adventure",
  password: "admin",
  port: 5432,
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
