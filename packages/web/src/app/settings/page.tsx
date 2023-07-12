import { redirect } from "next/navigation";

import { getSession } from "~/lib/auth";

export default async function AccountPage() {
  const [, session] = await getSession();

  if (!session) redirect("/");

  redirect("/settings/account");
}
