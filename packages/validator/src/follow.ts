import * as z from "zod";

export const follow = z.object({
  id: z.string(),
  userId: z.string(),
  projectId: z.string(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
