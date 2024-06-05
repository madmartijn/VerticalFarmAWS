const mssql = require("mssql");
let pool;

async function getPool() {
  if (pool) return pool; // if pool already exists, return it

  pool = new mssql.ConnectionPool({
    user: "admin",
    password: "KY56]St4J[%>KADQmODERPlVScyd",
    port: 1433,
    database: "VerticalFarm",
    server: "database-1.cpgsme0uejc2.eu-central-1.rds.amazonaws.com",
    options: {
      encrypt: false, // Enable encryption for security
      connectTimeout: 15000, // Set the connection timeout to 15 seconds
    },
  });

  pool.on("error", (err) => {
    console.error(err);
    pool.close();
    pool = null;
  });

  await pool.connect();

  return pool;
}

exports.handler = async (event) => {
  try {
    const pool = await getPool();

    const data =
      await pool.query`SELECT * FROM dbo.DataHistorie WHERE LadeId = ${event.pathParameters.LadeId.toString()}`;
    // no need to close the pool

    return { statusCode: 200, body: JSON.stringify(data.recordset) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
