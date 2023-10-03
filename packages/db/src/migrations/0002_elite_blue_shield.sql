ALTER TABLE "chapter" ADD COLUMN "slug" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapter_project_id_index" ON "chapter" ("project_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapter_slug_index" ON "chapter" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "chapter_project_id_and_slug_index" ON "chapter" ("project_id","slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chapter_order_index" ON "chapter" ("order");