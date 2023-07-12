import { getSession } from "~/lib/auth";

export default async function Home() {
  const [, session] = await getSession();

  const { user } = session ?? {};

  return <main className="whitespace-break-spaces">{user?.name}</main>;
}
