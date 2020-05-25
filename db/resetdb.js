


require("dotenv").config({ path: "../.env" });
const fs     = require("fs");
const path   = require("path");
const Client = require("pg-native");
const client = new Client();

const args        = process.argv.slice(2).map((arg) => arg.toLowerCase());
const environment = (args[0] || "");
const noSeeds     = (args.indexOf("noseeds") !== -1 || "");

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
  `postgresql://${process.env.DB_USERNAME}:<PASSWORD>@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;



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
  console.log(`\nConnecting to ${connectionString}`);
  client.connectSync(connectionString.replace("<PASSWORD>", process.env.DB_PASSWORD));
} catch (err) {
  console.error(`\nError connecting to Postgres: ${err}\n\nDid you forget to set up ".env"?\n`);
  process.exit();
}
try {
  const schemaPath = "schema";
  const schemaFile = "create_tables.sql";
  console.log(`Loading schema "./${path.join(schemaPath, schemaFile)}"`);
  runSqlFile(schemaPath, schemaFile);
} catch (err) {
  console.error(`\nError creating tables: ${err}`);
  client.end();
  process.exit();
}
try {
  if (!noSeeds) {
    const seedsPath = environment;
    console.log(`Loading seeds from "./${seedsPath}"`);
    runSqlFiles(seedsPath);
  } else {
    console.log(`Skipping seeds`);
  }
} catch (err) {
  console.error(`\nSkipping seeds: ${err}`);
}
client.end();
console.log();
