import * as z from "zod";

export const project = z.object({
  id: z.string(),
  cover: z.string().url().nullable(),
  name: z.string().min(2, {
    message: "Project names must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Project slugs must be at least 2 characters.",
  }),
  description: z.string().max(500, {
    message: "Project descriptions can not exceed 500 characters.",
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
