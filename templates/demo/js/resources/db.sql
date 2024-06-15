CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    author INTEGER NOT NULL,
    assignee INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    created INTEGER DEFAULT (CAST(STRFTIME('%s', 'now') AS INTEGER)),
    FOREIGN KEY(author) REFERENCES users(id),
    FOREIGN KEY(assignee) REFERENCES users(id)
);

INSERT INTO users (name, email, password) VALUES ('John Doe', 'john.doe@example.com', 'password123');
INSERT INTO users (name, email, password) VALUES ('Jane Doe', 'jane.doe@example.com', 'password456');
