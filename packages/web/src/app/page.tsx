import { getSession } from "~/lib/auth";

export default async function Home() {
  const [_, session] = await getSession();

  return <main className="whitespace-break-spaces">{session?.name}</main>;
}
