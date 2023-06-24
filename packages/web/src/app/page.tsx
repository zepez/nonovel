import { getUserById } from "~/lib/request";

export default async function Home() {
  const [_, user] = await getUserById({
    id: "0a2939ed-85f0-48ac-a390-43fa4ca188af",
  });

  return <main className="whitespace-break-spaces">{user?.name}</main>;
}
