# Give'rBoard

Give'rBoard is a whiteboard designed for distributed Agile development teams to perform Affinity Sizing estimation remotely.  While originating from a niche market, it has more general-purpose uses including personal organization and children's homework planning.

Check it out online at [giverboard.ml](https://giverboard.ml).

This was originally my final project for the Lighthouse Labs Web Development Bootcamp.  This repository is the current active development, but for the original project see [Estimatron2020](https://github.com/d0ugr/estimatron2020).

## **Directory structure**

```
client          Client-side React app
client/public   Public assets (e.g. index.html, manifest.json)
client/src      Client-side source code
server          Server-side Node.js app
server/src      Server source code
server/db       Database files (resetdb.js, schema, seeds)
test            Files used for testing (CSV files)
docs            Project documentation
backup          Old stuff that may or may not be useful

Do not push to repo:

client/build          Production build of the client-side React app
client/node_modules   Node.js packages
server/node_modules   Node.js packages
```

## **Support setup**

Give'rBoard requires [Node.js](https://nodejs.org) and [Postgres](https://www.postgresql.org/).  Node.js 14.2.0 and Postgres 12.3 were used during development.  Your mileage may vary with previous versions.

## **Development Setup**

```sh
cd /your/favourite/project/directory
git clone git@github.com:d0ugr/final-project.git
cd giverboard/server
npm install
cd giverboard/client
npm install
```

Create a `.env` file for the server to connect to the database.  `.env.development` can be used as-is if you like.  For example:

```
APP_NAME=giverboard
APP_PORT=3001

DB_HOSTNAME=localhost
DB_PORT=5432
DB_USERNAME=giverboard_development
DB_PASSWORD=giverboard_development
DB_DATABASE=giverboard_development
```

## **Database Setup**

You need to install PostgreSQL client libraries and tools to setup resetdb.  See [https://www.npmjs.com/package/pg-native] for details.  On Debian-based systems with APT, use:

```sh
apt install libpq-dev g++ make
```

To create the database (create role, database, and tables), you can run `giverboard/server/db/schema/create_development_database.sql`.  To do this in Debian for example:

```sh
cd giverboard/server/db/schema
sudo -u postgres psql -f create_development_database.sql
```

**Or** run the commands manually from psql:

```sql
CREATE USER giverboard_development WITH NOSUPERUSER PASSWORD 'giverboard_development';
CREATE DATABASE giverboard_development OWNER giverboard_development;
GRANT ALL ON DATABASE giverboard_development TO giverboard_development;
```

To create tables and optionally seed them with mock data, run the following script.  You can also use this to reset the database to a known state during development.  It drops tables and recreates them, so ignore any errors about relations that don't exist if this is the first time running it.

```sh
cd giverboard/server
npm run resetdb development [noseeds]
```

## **Run server**

Run the server with nodemon:

```sh
cd giverboard/server
npm start
```

## **Run client**

Run the client:

```sh
cd giverboard/client
npm start
```
