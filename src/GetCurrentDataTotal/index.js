const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const secret_name = "rds!db-08b378d2-fd52-4b72-a35a-53cdc01d922d";
const client = new SecretsManagerClient({
  region: "eu-central-1",
});

const mssql = require("mssql");

let response;

exports.handler = async (event) => {
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );

    const secret = response.SecretString;

    const pool = new mssql.ConnectionPool({
      user: secret.username,
      password: secret.password,
      port: 1433,
      server: "database-1.cpgsme0uejc2.eu-central-1.rds.amazonaws.com",
      options: {
        encrypt: true, // Enable encryption for security
      },
    });

    await pool.connect();

    console.log('connected');

    await pool.close();

    return { statusCode: 200, body: "result" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify("Error") };
  }
};
