# WB2020

WB2020 is super fun.

## **Run server**

Run the server with nodemon:

```sh
cd server
npm start
```

## **Run client**

Run the client:

```sh
cd client
npm start
```

## **Database Setup**

```postgres
CREATE USER final_project WITH NOSUPERUSER PASSWORD 'final_project';
CREATE DATABASE final_project OWNER final_project;
GRANT ALL ON DATABASE final_project TO final_project;
```
