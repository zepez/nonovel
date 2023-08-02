import * as z from "zod";

const schema = z.object({
  NEXT_PUBLIC_S3_DOMAIN: z.string(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
});

export default schema.parse({
  NEXT_PUBLIC_S3_DOMAIN: process.env.NEXT_PUBLIC_S3_DOMAIN,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
});
