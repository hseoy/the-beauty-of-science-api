DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS posts_score;
DROP TABLE IF EXISTS posts_comments;

BEGIN TRANSACTION;

CREATE TABLE posts (
  id SERIAL NOT NULL PRIMARY KEY,
  authorid INT NOT NULL,
  category TEXT DEFAULT 'common',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created TIMESTAMP NOT NULL,
  modified TIMESTAMP NOT NULL
);

CREATE TABLE posts_score (
  id SERIAL NOT NULL PRIMARY KEY,
  postid INT NOT NULL,
  score SMALLINT NOT NULL,
  evaluatorid INT NOT NULL
);

CREATE TABLE posts_comments (
  id SERIAL NOT NULL PRIMARY KEY,
  postid INT NOT NULL,
  parentid INT DEFAULT 0,
  authorid INT NOT NULL,
  content TEXT NOT NULL,
  created TIMESTAMP NOT NULL,
  modified TIMESTAMP NOT NULL
);

COMMIT;