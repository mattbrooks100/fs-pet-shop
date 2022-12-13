DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    age INT,
    name TEXT,
    kind TEXT
);