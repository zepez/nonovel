import { db } from "@nonovel/db";
import { placeholder } from "drizzle-orm";

export const getProjectBySlugPrepared = db.query.project
  .findFirst({
    where: (project, { eq }) => eq(project.slug, placeholder("slug")),
    with: {
      genres: {
        columns: {
          id: true,
        },
        with: {
          genre: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      users: {
        columns: {
          id: true,
          role: true,
        },
        with: {
          user: {
            columns: {
              id: true,
            },
            with: {
              profile: true,
            },
          },
        },
      },
    },
  })
  .prepare("get_project_by_slug_prepared");

export const getProjectByIdPrepared = db.query.project
  .findFirst({
    where: (project, { eq }) => eq(project.id, placeholder("id")),
  })
  .prepare("get_project_by_id_prepared");
