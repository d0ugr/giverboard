# Give'rBoard

Give'rBoard is a whiteboard designed for distributed Agile development teams to perform Affinity Sizing estimation remotely.  While originating from a niche market, it has more general-purpose uses including personal organization and children's homework planning.

Check it out online at [giverboard.ml](https://giverboard.ml).

This was originally my final project for the Lighthouse Labs Web Development Bootcamp.  This repository is the current active development, but for the original project see [Estimatron2020](https://github.com/d0ugr/estimatron2020).

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

Create a `.env` file for the server to connect to the database.

`.env.development` can be used as-is if you like.  For example:

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

To create and initialize the database (create role, database, and tables):

```sh
cd giverboard/server
npm run resetdb development create
```

Run without `create` to reset the database after it has been created:

```sh
npm run resetdb development
```

If you ever need to manually run SQL scripts, you might find this useful in Debian-based systems:

```sh
sudo -u postgres psql -f fun_stuff_to_do.sql
```

**Or** run the commands manually:

```postgres
CREATE USER giverboard_development WITH NOSUPERUSER PASSWORD 'giverboard_development';
CREATE DATABASE giverboard_development OWNER giverboard_development;
GRANT ALL ON DATABASE giverboard_development TO giverboard_development;
```

Create tables and seed them (this will require `.env`):

```sh
cd giverboard/server
npm run resetdb
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
