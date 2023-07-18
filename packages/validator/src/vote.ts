import * as z from "zod";

export const vote = z.object({
  id: z.string(),
  userId: z.string(),
  resourceId: z.string(),
  resourceType: z.enum(["review", "chapter", "comment"]),
  value: z.number().min(-1).max(1),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
