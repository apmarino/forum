DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS topics;

PRAGMA foreign_keys=ON;


CREATE TABLE topics(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  title TEXT,
  votes INTEGER DEFAULT 0,
  content TEXT,
  tags TEXT,
  created DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE comments(
  comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  topic_id INTEGER,
  content TEXT,
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);



