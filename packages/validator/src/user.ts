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
  emailVerified: z
    .string()
    .datetime()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
