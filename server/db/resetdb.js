


require("dotenv").config();

const fs     = require("fs");
const path   = require("path");
const Client = require("pg-native");
const client = new Client();

const args           = process.argv.slice(2);
const environment    = (args[0] || "").toLowerCase();
const createDatabase = (args[1] || "").toLowerCase() === "create";

if (!environment) {
  console.error(`Specify an environment (i.e. "development", "testing", or "production".\n`);
  process.exit(0);
} else {
  switch (environment) {
    case "development":
    case "testing":
    case "production":
      break;
    default:
      console.error(`"${environment}" is not a valid environment.\n`);
      process.exit(0);
  }
}

const connectionString = process.env.DB_URL ||
  `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;



const runSqlFile = (pathSpec, filename) => {
  file = path.join(pathSpec, filename);
  const sql = fs.readFileSync(file, "utf8");
  console.log(`Running ${file}`);
  client.querySync(sql);
};

const runSqlFiles = (pathSpec) => {
  const filenames = fs.readdirSync(pathSpec);
  console.log(filenames);
  for (const filename of filenames) {
    runSqlFile(pathSpec, filename);
  }
};



try {
  console.log(`\nConnecting to Postgres using ${connectionString}`);
  client.connectSync(connectionString);
  const schemaPath = "db/schema";
  const schemaFile = "create_tables.sql";
  const seedsPath  = path.join("db/seeds", environment);
  if (createDatabase) {
    const filename = `create_${environment}_database.sql`;
    console.log(`Creating database with "./${path.join(schemaPath, filename)}"`);
    runSqlFile(schemaPath, filename);
  }
  console.log(`Loading schema "${path.join(schemaPath, schemaFile)}"`);
  runSqlFile(schemaPath, schemaFile);
  console.log(`Loading seeds from "./${seedsPath}"`);
  runSqlFiles(seedsPath);
  client.end();
} catch (err) {
  console.error(`\nError: ${err}\n\nDid you forget to set up ".env"?`);
  client.end();
}
console.log();
