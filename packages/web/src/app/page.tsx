import { getUserById } from "~/lib/request";

export default async function Home() {
  const [_, user] = await getUserById({
    id: "ddd2b0b0-280b-4ae3-8395-e06a52497d86",
  });

  return <main>{JSON.stringify(user)}</main>;
}
