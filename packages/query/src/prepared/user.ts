import { db, user } from "@nonovel/db";
import { eq, placeholder } from "drizzle-orm";

export const getUserByIdPrepared = db
  .select({ user })
  .from(user)
  .where(eq(user.id, placeholder("id")))
  .limit(1)
  .prepare("get_user_by_id_prepared");
