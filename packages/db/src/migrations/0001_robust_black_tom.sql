CREATE TABLE IF NOT EXISTS "project_genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genre" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_project_genre_ids" ON "project_genres" ("project_id","genre_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_genre_slug" ON "genre" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_genre_name" ON "genre" ("name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_genres" ADD CONSTRAINT "project_genres_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_genres" ADD CONSTRAINT "project_genres_genre_id_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "genre"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
