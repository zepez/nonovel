import * as z from "zod";

export const user = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, {
      message: "Display name must be at least 2 characters.",
    })
    .max(50, {
      message: "Display name can not exceed 50 characters.",
    }),
  email: z.string().email(),
  emailVerified: z.string().datetime().nullable(),
  image: z.string().url().nullable(),
  username: z
    .string()
    .min(2, {
      message: "Usernames must be at least 2 characters.",
    })
    .max(50, {
      message: "Usernames can not exceed 50 characters.",
    }),
  description: z.string().max(160, {
    message: "User bios can not exceed 160 characters.",
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
