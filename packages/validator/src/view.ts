import * as z from "zod";

export const anonView = z.object({
  id: z.string(),
  projectId: z.string(),
  chapterId: z.string(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const userView = anonView.extend({
  userId: z.string(),
});

export const view = userView.extend({
  userId: z.string().optional(),
});
