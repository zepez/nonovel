import * as z from "zod";

const schema = z.object({
  NEXT_PUBLIC_SUPERADMIN_EMAILS: z.string().default(""),
});

export default schema.parse({
  NEXT_PUBLIC_SUPERADMIN_EMAILS: process.env.NEXT_PUBLIC_SUPERADMIN_EMAILS,
});
