import type { User } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import { getUserByIdPrepared, updateUserByIdPrepared } from "../prepared";
import { user as validator } from "@nonovel/validator";

export interface GetUserByIdOptions {
  id: User["id"];
}

export const getUserById = async (opts: GetUserByIdOptions) => {
  try {
    const parsed = validator.pick({ id: true }).parse(opts);

    const result = (await getUserByIdPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetUserByIdReturn = Awaited<ReturnType<typeof getUserById>>;

// ########################################################

export interface UpdateUserByIdOptions {
  id: User["id"];
  name: User["name"];
}

export const updateUserById = async (opts: UpdateUserByIdOptions) => {
  try {
    const parsed = validator
      .pick({
        id: true,
        name: true,
      })
      .parse(opts);

    await updateUserByIdPrepared.execute(parsed);

    return [null, true] as const;
  } catch (err) {
    const error = new ServerError(
      "UpdateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type UpdateUserByIdReturn = Awaited<ReturnType<typeof updateUserById>>;
