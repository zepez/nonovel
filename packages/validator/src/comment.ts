import * as z from "zod";

export const comment = z.object({
  id: z.string(),
  userId: z.string(),
  resourceId: z.string(),
  resourceType: z.enum(["profile", "project", "chapter"]),
  parentId: z.string().nullable(),
  content: z
    .string()
    .min(2, {
      message: "Comments must be at least 2 characters.",
    })
    .max(1000, {
      message: "Comments can not exceed 1000 characters.",
    }),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
