import { type User, selectUserSchema } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getUserByIdPrepared } from "../prepared";

export interface GetUserByIdOptions {
  id: User["id"];
}

export const getUserById = async (opts: GetUserByIdOptions) => {
  try {
    const schema = selectUserSchema.pick({ id: true });
    const { id } = schema.parse(opts);

    const result = (await getUserByIdPrepared.execute({ id })) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetUserByIdReturn = Awaited<ReturnType<typeof getUserById>>;
