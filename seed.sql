
INSERT INTO topics (title, username, content, tags, votes) VALUES ("The Matrix", "apmarino", "Lorem Ipsum", "new, movies", 25);
INSERT INTO topics (title, username, content, tags, votes) VALUES ("The Fifth Element", "Wacko", "Lorem Ipsum", "new, movies", 20);
INSERT INTO topics (title, username, content, tags, votes) VALUES ("Star Wars", "Dot", "Lorem Ipsum", "new, movies", 15);

INSERT INTO comments (username, topic_id, content) VALUES ("apmarino", 1, "This movie is awesome");
INSERT INTO comments (username, topic_id, content) VALUES ("Wacko", 1, "He is the one");
INSERT INTO comments (username, topic_id, content) VALUES ("Dot", 1, "I don't beleive it");
