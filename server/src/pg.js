const { Pool } = require("pg");

module.exports = function(dbParams) {

  const pool = new Pool(dbParams);

  return {
    query: (sql, params, callback) => {
      const start = Date.now();
      if (typeof callback === "function") {
        return pool.query(sql, params, (err, res) => {
          const duration = Date.now() - start;
          console.log(`Executed query\n  ${sql}${params ? ` ${JSON.stringify(params)}` : ""}\n  ${duration}\n  rows: ${res.rowCount}`);
          callback(err, res);
        });
      } else {
        return pool.query(sql, params)
          .then((res) => {
            const duration = Date.now() - start;
            console.log(`Executed query\n  ${sql}${params ? ` ${JSON.stringify(params)}` : ""}\n  ${duration}\n  rows: ${res.rowCount}`);
            return res;
          }).catch((err) => {
            const duration = Date.now() - start;
            console.log(`Query failed\n  ${sql}${params ? ` ${JSON.stringify(params)}` : ""}\n  ${duration}\n  ERROR: ${err}`);
            return err;
          });
      }
    }
  };

};
