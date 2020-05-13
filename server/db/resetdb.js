


require("dotenv").config();

const fs     = require("fs");
const Client = require("pg-native");
const client = new Client();

const connectionString = process.env.DB_URL ||
  `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;



const runSqlFiles = (path) => {
  const filenames = fs.readdirSync(path);
  console.log(filenames);
  for (const filename of filenames) {
    const sql = fs.readFileSync(`${path}/${filename}`, "utf8");
    console.log(`Running ${filename}`);
    client.querySync(sql);
  }
};



try {
  console.log(`\nConnecting to Postgres using ${connectionString}`);
  client.connectSync(connectionString);
  console.log(`Loading schema "./db/schema"`);
  runSqlFiles("./db/schema");
  console.log(`Loading seeds from "./db/seeds"`);
  runSqlFiles("./db/seeds");
  client.end();
} catch (err) {
  console.error(`\nError: ${err}`);
  client.end();
}
console.log();
