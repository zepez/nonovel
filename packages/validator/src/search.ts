import * as z from "zod";

export const search = z.object({
  query: z
    .string()
    .min(3, {
      message: "Search three or more characters to get results. ",
    })
    .max(50, {
      message: "Search queries can not be over 50 characters.",
    }),
});
