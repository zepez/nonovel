import { redirect } from "next/navigation";

import { getSession } from "~/lib/auth";
import { EditProfile } from "~/components/settings";
import { LayoutWrapper } from "~/components/shared";

export default async function AccountPage() {
  const [_, session] = await getSession();

  if (!session) redirect("/");

  return (
    <>
      <LayoutWrapper className="mt-4">
        <EditProfile session={session} />
      </LayoutWrapper>
    </>
  );
}
