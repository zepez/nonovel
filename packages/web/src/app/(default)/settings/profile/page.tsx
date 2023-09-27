import { redirect } from "next/navigation";

import { getSession } from "~/lib/server";
import { EditProfile } from "~/components/settings";

export default async function AccountPage() {
  const [, session] = await getSession();

  if (!session) redirect("/");

  return (
    <>
      <EditProfile session={session} />
    </>
  );
}
