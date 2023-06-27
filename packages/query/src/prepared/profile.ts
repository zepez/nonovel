import { db, profile } from "@nonovel/db";
import { placeholder, eq } from "drizzle-orm";

export const getProfileByIdPrepared = db.query.profile
  .findFirst({
    where: (profile, { eq }) => eq(profile.id, placeholder("id")),
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
