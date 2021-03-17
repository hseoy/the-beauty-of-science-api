DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS users_login;
DROP TABLE IF EXISTS users_avatar;

BEGIN TRANSACTION;

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(100),
  email TEXT UNIQUE NOT NULL,
  experience BIGINT DEFAULT 0,
  postcnt BIGINT DEFAULT 0,
  quizcnt BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL
);

CREATE TABLE users_login (
  id SERIAL NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
  password VARCHAR(100) NOT NULL,
);

CREATE TABLE users_avatar (
  id SERIAL NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  filename TEXT,
  filepath TEXT,
  mimetype TEXT,
  size BIGINT
);

COMMIT;