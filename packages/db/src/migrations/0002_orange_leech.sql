DO $$ BEGIN
 CREATE TYPE "comment_resource_type" AS ENUM('profile', 'project', 'chapter');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "resource_type" "comment_resource_type" NOT NULL;