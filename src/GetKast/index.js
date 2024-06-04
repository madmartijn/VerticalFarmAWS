const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const mssql = require("mssql");

const secret_name = "rds!db-08b378d2-fd52-4b72-a35a-53cdc01d922d";
const client = new SecretsManagerClient({
  region: "eu-central-1",
});

let pool;

async function getPool() {
  if (pool) return pool; // if pool already exists, return it

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secret_name,
      VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
    })
  );

  console.log(response);

  const secret = JSON.parse(response.SecretString);

  console.log(secret);

  pool = new mssql.ConnectionPool({
    user: secret.username,
    password: secret.password,
    port: MICROSOFTSQL_PORT,
    database: "VerticalFarm",
    server: MICROSOFTSQL_HOSTNAME,
    options: {
      encrypt: true, // Enable encryption for security
      connectTimeout: 15000, // Set the connection timeout to 15 seconds
    },
  });

  console.log(pool);

  pool.on("error", (err) => {
    console.error(err);
    pool.close();
    pool = null;
  });

  await pool.connect();

  console.log("Connected to Microsoft SQL Server");

  return pool;
}

exports.handler = async (event) => {
  const pool = await getPool();
  const data = await pool.query`SELECT * FROM dbo.Kast WHERE LadeId = $event.pathParameters.LadeId`;
  // no need to close the pool

  return { statusCode: 200, body: data };
};
