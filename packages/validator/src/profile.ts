import * as z from "zod";

export const profile = z.object({
  id: z.string(),
  userId: z.string(),
  image: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().url().nullable()
  ),
  username: z
    .string()
    .min(2, {
      message: "Usernames must be at least 2 characters.",
    })
    .max(32, {
      message: "Usernames can not exceed 50 characters.",
    })
    .refine(
      (value) => {
        const regex = /^[a-zA-Z0-9_.]+$/;
        return regex.test(value);
      },
      {
        message:
          "Username can only contain alphanumeric, underscore, and period characters",
      }
    ),
  bio: z.string().max(160, {
    message: "User bios can not exceed 160 characters.",
  }),
  countryCode: z.preprocess(
    (v) => (v === "" ? null : v),
    z
      .string()
      .length(2, {
        message: "Country code must be 2 characters.",
      })
      .nullable()
  ),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
