import { db, profile } from "@nonovel/db";
import { placeholder, eq } from "drizzle-orm";

export const getProfileByUsernamePrepared = db.query.profile
  .findFirst({
    where: (profile, { eq }) => eq(profile.username, placeholder("username")),
    with: {
      user: {
        columns: {
          id: true,
        },
        with: {
          projects: {
            with: {
              project: true,
            },
          },
        },
      },
    },
  })
  .prepare("get_profile_by_id_prepared");

export const updateProfileByIdPrepared = db
  .update(profile)
  .set({
    username: placeholder("username") as unknown as string,
    image: placeholder("image") as unknown as string,
  })
  .where(eq(profile.id, placeholder("id")))
  .prepare("update_profile_by_id_prepared");

export const getProfileByUserIdPrepared = db.query.profile
  .findFirst({
    where: (profile, { eq }) => eq(profile.userId, placeholder("id")),
  })
  .prepare("get_profile_by_user_id_prepared");
