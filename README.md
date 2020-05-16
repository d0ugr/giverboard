# Estimatron2020

Estimatron2020 is whiteboard designed for distributed Agile development teams to perform Affinity Sizing estimation remotely.  While originating from a niche market, it has more general-purpose uses including personal organization and children's homework planning.

## **Support setup**

Estimatron2020 requires [Node.js](https://nodejs.org) and [Postgres](https://www.postgresql.org/).  Node.js 14.2.0 and Postgres 12.3 were used during development.  Your mileage may vary with previous versions.

## **Development Setup**

```sh
cd /your/favourite/project/directory
git clone git@github.com:d0ugr/final-project.git
cd estimatron2020/server
npm install
cd estimatron2020/client
npm install
```

Create a `.env` file for the server to connect to the database.

`.env.development` can be used as-is if you like.  For example:

```
APP_NAME=Estimatron2020
APP_PORT=3001

DB_HOSTNAME=localhost
DB_PORT=5432
DB_USERNAME=estimatron2020_development
DB_PASSWORD=estimatron2020_development
DB_DATABASE=estimatron2020_development
```

## **Database Setup**

Execute the file `estimatron2020/server/db/create_development_database.sql` with psql.  For example:

```sh
cd estimatron2020/server/db
sudo -u postgres psql -f create_development_database.sql
```

**Or** run the commands manually:

```postgres
CREATE USER estimatron2020_development WITH NOSUPERUSER PASSWORD 'estimatron2020_development';
CREATE DATABASE estimatron2020_development OWNER estimatron2020_development;
GRANT ALL ON DATABASE estimatron2020_development TO estimatron2020_development;
```

Create tables and seed them (this will require `.env`):

```sh
cd estimatron2020/server
npm run resetdb
```

## **Run server**

Run the server with nodemon:

```sh
cd estimatron2020/server
npm start
```

## **Run client**

Run the client:

```sh
cd estimatron2020/client
npm start
```
