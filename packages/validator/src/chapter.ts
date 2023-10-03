import * as z from "zod";

export const chapter = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  order: z.number(),
  slug: z.string(),
  contentType: z.enum(["md", "html"]),
  content: z.string(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
