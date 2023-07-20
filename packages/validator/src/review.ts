import * as z from "zod";

export const review = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  projectId: z.string(),
  score: z.preprocess(
    (v) => {
      if (typeof v === "string") return parseFloat(z.string().parse(v));
      if (!v) return 0;

      return v;
    },
    z
      .number()
      .min(0, {
        message: "Review scores can not be under 0.",
      })
      .max(5, {
        message: "Review scores can not be over 5.",
      })
  ),
  comment: z.string().max(1000, {
    message: "Reviews can not exceed 1000 characters.",
  }),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
