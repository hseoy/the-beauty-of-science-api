DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS posts_score;
DROP TABLE IF EXISTS posts_comments;

BEGIN TRANSACTION;

CREATE TABLE posts (
  id SERIAL NOT NULL PRIMARY KEY,
  author TEXT NOT NULL,
  category TEXT DEFAULT 'common',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  participantcnt BIGINT DEFAULT 0,
  totalpoint BIGINT DEFAULT 0,
  created TIMESTAMP NOT NULL,
  modified TIMESTAMP NOT NULL
);

CREATE TABLE posts_score (
  id SERIAL NOT NULL PRIMARY KEY,
  postid INT NOT NULL,
  score SMALLINT NOT NULL,
  evaluator TEXT NOT NULL
);

CREATE TABLE posts_comments (
  id SERIAL NOT NULL PRIMARY KEY,
  postid INT NOT NULL,
  parentid INT DEFAULT 0,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created TIMESTAMP NOT NULL,
  modified TIMESTAMP NOT NULL
);

COMMIT;