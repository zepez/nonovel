import { type Profile, type User } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  getProfileByIdPrepared,
  updateProfileByIdPrepared,
  getProfileByUserIdPrepared,
} from "../prepared";
import {
  profile as validator,
  user as userValidator,
} from "@nonovel/validator";

export interface GetProfileByIdOptions {
  id: Profile["id"];
}

export const getProfileById = async (opts: GetProfileByIdOptions) => {
  try {
    const parsed = validator.pick({ id: true }).parse(opts);

    const result = (await getProfileByIdPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetProfileByIdReturn = Awaited<ReturnType<typeof getProfileById>>;

// ########################################################

export interface UpdateProfileByIdOptions {
  id: Profile["id"];
  username: Profile["username"];
}

export const updateProfileById = async (opts: UpdateProfileByIdOptions) => {
  try {
    const parsed = validator
      .pick({
        id: true,
        username: true,
        image: true,
      })
      .parse(opts);

    await updateProfileByIdPrepared.execute(parsed);

    return [null, true] as const;
  } catch (err) {
    const error = new ServerError(
      "UpdateResourceError",
      err as ServerErrorType
    );
    return [error, null] as const;
  }
};

export type UpdateProfileByIdReturn = Awaited<
  ReturnType<typeof updateProfileById>
>;

// ########################################################

export interface GetProfileByUserIdOptions {
  id: User["id"];
}

export const getProfileByUserId = async (opts: GetProfileByUserIdOptions) => {
  try {
    const parsed = userValidator.pick({ id: true }).parse(opts);

    const result = (await getProfileByUserIdPrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetProfileByUserIdReturn = Awaited<
  ReturnType<typeof getProfileByUserId>
>;
