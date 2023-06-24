import type { User } from "@nonovel/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: User["id"] | null;
      name: User["name"];
      email: User["email"];
      image: User["image"];
    };
  }
}
