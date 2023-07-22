import * as z from "zod";

export const genre = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
