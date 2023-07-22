import { db, genre } from "@nonovel/db";
import { placeholder } from "drizzle-orm";

export const getGenreManifestPrepared = db
  .select({ id: genre.id, name: genre.name, slug: genre.slug })
  .from(genre)
  .prepare("get_genre_manifest_prepared");

export const getGenreBySlugPrepared = db.query.genre
  .findFirst({
    where: (genre, { eq }) => eq(genre.slug, placeholder("slug")),
  })
  .prepare("get_genre_by_slug_prepared");
