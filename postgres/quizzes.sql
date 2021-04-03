DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS quiz_participant;

BEGIN TRANSACTION;

CREATE TABLE quizzes (
  id SERIAL NOT NULL PRIMARY KEY,
  authorid INT NOT NULL,
  title TEXT NOT NULL,
  commentary TEXT NOT NULL,
  answers TEXT[] NOT NULL,
  rightanswer TEXT NOT NULL,
  participantcnt BIGINT DEFAULT 0,
  difficulty SMALLINT NOT NULL,
  created TIMESTAMP NOT NULL,
  modified TIMESTAMP NOT NULL
);

CREATE TABLE quiz_participant (
  id SERIAL NOT NULL PRIMARY KEY,
  userid INT NOT NULL,
  quizid INT NOT NULL,
  isright BOOLEAN NOT NULL,
  submitted TIMESTAMP NOT NULL
);

COMMIT;