import usePool from "./use-pool.js";

export const single = (val) => {
  return val[0];
};

const query = (logName, sql, params = [], wrapper) => {
  return new Promise((resolve, reject) => {
    usePool(sql, params, (error, result) => {
      if (error) {
        return reject(new Error(`${logName} ${error}`));
      }
      resolve(wrapper ? wrapper(result.rows) : result.rows);
    });
  });
};

export default query;
