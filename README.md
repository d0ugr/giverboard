# WB2020

WB2020 is super fun.

## **Support setup**

WB2020 requires Node.js and Postgres.  Node.js 14.2.0 and Postgres 12.3 were used during development.  Your mileage may vary with previous versions.

## **Development Setup**

```sh
cd /your/favourite/project/directory
git clone git@github.com:d0ugr/final-project.git
cd wb2020/server
npm install
cd wb2020/client
npm install
```

Create a `.env` file for the server to connect to the database.

`.env.development` can be used as-is if you like.  For example:

```
APP_NAME=WB2020
APP_PORT=3001

DB_HOSTNAME=localhost
DB_PORT=5432
DB_USERNAME=wb2020_development
DB_PASSWORD=wb2020_development
DB_DATABASE=wb2020_development
```

## **Database Setup**

Execute the file `wb2020/server/db/create_development_database.sql` with psql.  For example:

```sh
cd wb2020/server/db
sudo -u postgres psql -f create_development_database.sql
```

**Or** run the commands manually:

```postgres
CREATE USER wb2020_development WITH NOSUPERUSER PASSWORD 'wb2020_development';
CREATE DATABASE wb2020_development OWNER wb2020_development;
GRANT ALL ON DATABASE wb2020_development TO wb2020_development;
```

Create tables and seed them (this will require `.env`):

```sh
cd wb2020/server
npm run resetdb
```

## **Run server**

Run the server with nodemon:

```sh
cd wb2020/server
npm start
```

## **Run client**

Run the client:

```sh
cd wb2020/client
npm start
```
