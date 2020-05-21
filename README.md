# Estimatron2020

Estimatron2020 is a whiteboard designed for distributed Agile development teams to perform Affinity Sizing estimation remotely.  While originating from a niche market, it has more general-purpose uses including personal organization and children's homework planning.

Check out a demo online at [estimatron.ml](https://estimatron.ml).

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

To create and initialize the database (create role, database, and tables):

```sh
cd estimatron2020/server
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

**Deploy production**

_INCOMPLETE_

```sh
groupadd -g 997 estimatron
useradd -g 997 -u 997 -M -p <PASSWORD> estimatron
```
