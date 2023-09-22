import { headers } from "next/headers";
import { notFound } from "next/navigation";
import config from "@nonovel/config-server";
import type { GetProjectByIdReturn } from "@nonovel/query";

import { getURL } from "~/lib/string";
import { CoverOne, CoverTwo } from "~/components/cover";
import "../../../styles/globals.css";
import "../../../styles/cover.css";

interface Props {
  searchParams: {
    id: string;
  };
}

export default async function Page({ searchParams: q }: Props) {
  const headersList = headers();
  const auth = headersList.get("Authorization");

  if (!auth || auth !== `Bearer ${config.NB_GEN_SECRET_KEY}`) return notFound();

  const reqURL = `${getURL()}api/gen/cover/data`;
  const reqBody = JSON.stringify({ id: q.id });

  const res = await fetch(reqURL, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      "Content-Length": reqBody.length.toString(),
      Authorization: `Bearer ${config.NB_GEN_SECRET_KEY}`,
    }),
    body: reqBody,
  });

  if (!res.ok) {
    return notFound();
  }

  const response = (await res.json()) as {
    success: boolean;
    data: { background: string; project: GetProjectByIdReturn[1] };
  };

  if (!response.success || !response.data) {
    return notFound();
  }

  const { data } = response;

  if (!data.project || !data.project.penName) {
    return notFound();
  }

  const covers = [CoverOne, CoverTwo];
  const Cover = covers[Math.floor(Math.random() * covers.length)];

  return (
    <Cover
      background={data.background}
      name={data.project.name}
      penName={data.project.penName}
    />
  );
}
