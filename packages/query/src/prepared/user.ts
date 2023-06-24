import { db } from "@nonovel/db";
import { placeholder } from "drizzle-orm";

export const getUserByIdPrepared = db.query.user
  .findFirst({
    where: (users, { eq }) => eq(users.id, placeholder("id")),
    with: {
      projects: {
        with: {
          project: true,
        },
      },
    },
  })
  .prepare("get_user_by_id_prepared");
