-- Drop and recreate all tables

DROP TABLE IF EXISTS cards        CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS sessions     CASCADE;

CREATE TABLE sessions (
  id            SERIAL    NOT NULL PRIMARY KEY,
  session_key   TEXT      NOT NULL UNIQUE DEFAULT '',
  username      TEXT      NOT NULL DEFAULT '',
  password      TEXT      NOT NULL DEFAULT '',
  host_password TEXT      NOT NULL DEFAULT '',
  email         TEXT      NOT NULL DEFAULT '',
  name          TEXT      NOT NULL DEFAULT '',
  description   TEXT      NOT NULL DEFAULT '',
  settings      JSONB     NOT NULL DEFAULT '{}',
  history       JSONB     NOT NULL DEFAULT '{}',
  start         TIMESTAMP,
  stop          TIMESTAMP,
  created       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
  id         SERIAL    NOT NULL PRIMARY KEY,
  session_id INTEGER   NOT NULL REFERENCES sessions(id),
  content    JSONB     NOT NULL DEFAULT '{}',
  style      JSONB     NOT NULL DEFAULT '{}',
  position   JSONB     NOT NULL DEFAULT '{ "x": 0, "y": 0 }',
  size       TEXT      NOT NULL DEFAULT '',
  notes      TEXT      NOT NULL DEFAULT '',
  created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
  id         SERIAL    NOT NULL PRIMARY KEY,
  session_id INTEGER   NOT NULL REFERENCES sessions(id),
  client_key TEXT      NOT NULL UNIQUE DEFAULT '',
  sequence   INTEGER   NOT NULL DEFAULT -1,
  name       TEXT      NOT NULL DEFAULT '',
  settings   JSONB     NOT NULL DEFAULT '{}',
  created    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
