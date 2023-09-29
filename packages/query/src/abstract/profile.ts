import type { Profile } from "@nonovel/db";
import { ServerError, ServerErrorType } from "@nonovel/lib";
import {
  getProfileByUsernamePrepared,
  updateProfileByIdPrepared,
  getProfileByUserIdPrepared,
} from "../prepared";
import {
  profile as validator,
  user as userValidator,
} from "@nonovel/validator";

export interface GetProfileByUsernameOptions {
  username: Profile["username"];
}

export const getProfileByUsername = async (
  opts: GetProfileByUsernameOptions
) => {
  try {
    const parsed = validator.pick({ username: true }).parse(opts);

    const result = (await getProfileByUsernamePrepared.execute(parsed)) ?? null;

    return [null, result] as const;
  } catch (err) {
    const error = new ServerError("GetResourceError", err as ServerErrorType);
    return [error, null] as const;
  }
};

export type GetProfileByUsernameReturn = Awaited<
  ReturnType<typeof getProfileByUsername>
>;

// ########################################################

export interface UpdateProfileByIdOptions {
  id: Profile["id"];
  username: Profile["username"];
  countryCode: Profile["countryCode"];
  bio: Profile["bio"];
}

export const updateProfileById = async (opts: UpdateProfileByIdOptions) => {
  try {
    const parsed = validator
      .pick({
        id: true,
        username: true,
        countryCode: true,
        bio: true,
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
  id: Profile["userId"];
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
