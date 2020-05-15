# WB2020

WB2020 is super fun.

## **Development Setup**

```sh
git clone git@github.com:d0ugr/final-project.git
cd final-project/server
npm install
cd final-project/client
npm install
```

## **Database Setup**

```postgres
CREATE USER final_project WITH NOSUPERUSER PASSWORD 'final_project';
CREATE DATABASE final_project OWNER final_project;
GRANT ALL ON DATABASE final_project TO final_project;
```

Create tables and seed them:

```sh
cd final-project/server
npm run resetdb
```

## **Run server**

Run the server with nodemon:

```sh
cd final-project/server
npm start
```

## **Run client**

Run the client:

```sh
# cd final-projectclient
npm start
```
