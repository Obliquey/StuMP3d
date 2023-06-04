
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- * (that's why I edited it 😄)
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL, --don't want anyone having the same username or password
    "password" VARCHAR (1000) UNIQUE NOT NULL,
    "current_score" VARCHAR (200) DEFAULT 0, -- needed to update this to start at 0 for each new user
    "current_streak" VARCHAR (200) DEFAULT 0,
    "access_token" VARCHAR (400),
    "refresh_token" VARCHAR (400),
    "token_expires" VARCHAR(200)
);

CREATE TABLE "songs" (
	"id" SERIAL PRIMARY KEY,
	"song_name" VARCHAR (200) UNIQUE NOT NULL,
	"artist" VARCHAR (200) NOT NULL,
	"album" VARCHAR (200) NOT NULL,
	"cover_art" VARCHAR (200) NOT NULL,
	"year_released" VARCHAR (200) NOT NULL
);

CREATE TABLE "history" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER REFERENCES users NOT NULL,
	"song_id" INTEGER REFERENCES songs NOT NULL,
	"correctly_guessed" BOOLEAN NOT NULL,
	"timestamp" TIMESTAMP
);