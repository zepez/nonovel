import { db, chapter as chapterSchema } from "./index";
import slugify from "slugify";
import { eq } from "drizzle-orm";

// the war of the worlds: eb850575-3156-4845-a697-e0af5d9c5bb0
// a room with a view: c13ec9e0-d6b7-4e34-91db-3f669a1d8356
// alice in wonderland: 32799dce-feda-4428-97a8-0bcc5012f37c
// dracula: 31d0e50e-b2a7-4d4d-8d03-26af794d1bf1
// middlemarch: c6fd6d10-9ba7-4eef-8244-b88ea8e159f9
// romeo and juliet: adfff415-904b-44eb-b2e3-3d273eb648a6
// the art of war: b74f4b07-94c2-4676-82ad-cb486922dca6
// the enchanted april: 1a346f0d-827f-4315-a9af-9e9120b308d6
// the great gatsby: 59421c59-5ff1-446a-8d1f-f8f7a321101c
// three musketeers: ae658e59-1c6c-46ee-9383-c559b0699ebf
// war and peace: 54fd73a9-5028-4d46-aeed-198f86c634a2

const main = async () => {
  const chapters = await db.query.chapter.findMany({
    where: (chapter, { eq }) =>
      eq(chapter.projectId, "54fd73a9-5028-4d46-aeed-198f86c634a2"),
    orderBy: (chapter, { asc }) => [asc(chapter.order)],
  });

  for (const chapter of chapters) {
    if (chapter.slug || !chapter.name) continue;

    const slug = slugify(chapter.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
      trim: true,
    });

    await db
      .update(chapterSchema)
      .set({ slug })
      .where(eq(chapterSchema.id, chapter.id));

    console.log({
      name: chapter.name,
      order: chapter.order,
      slug,
    });
  }
};

void main();
