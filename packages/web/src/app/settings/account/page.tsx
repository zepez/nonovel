import { redirect } from "next/navigation";

import { getSession } from "~/lib/auth";
import { EditAccount } from "~/components/settings";

export default async function AccountPage() {
  const [, session] = await getSession();

  if (!session) redirect("/");

  return (
    <>
      <EditAccount session={session} />
    </>
  );
}
