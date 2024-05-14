CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
