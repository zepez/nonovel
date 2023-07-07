import * as z from "zod";

export const view = z.object({
  id: z.string(),
  userId: z.string().optional(),
  projectId: z.string(),
  chapterId: z.string(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
