import { db, user } from "@nonovel/db";
import { placeholder, eq } from "drizzle-orm";

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

export const updateUserByIdPrepared = db
  .update(user)
  .set({ name: placeholder("name") as unknown as string })
  .where(eq(user.id, placeholder("id")))
  .prepare("update_user_by_id_prepared");
