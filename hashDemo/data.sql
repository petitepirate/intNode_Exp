DROP DATABASE IF EXISTS express_auth_test;

CREATE DATABASE express_auth_test;

\c express_auth_test;

DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  username TEXT NOT NULL PRIMARY KEY,
  password TEXT NOT NULL
);

\q
