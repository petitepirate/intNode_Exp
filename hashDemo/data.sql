DROP DATABASE IF EXISTS shenanigans;

CREATE DATABASE shenanigans;

\c shenanigans;

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  username TEXT NOT NULL PRIMARY KEY,
  password TEXT NOT NULL
);

\q
