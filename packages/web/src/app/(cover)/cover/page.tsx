import { headers } from "next/headers";
import { notFound } from "next/navigation";
import config from "@nonovel/config-server";
import type { GetProjectByIdReturn } from "@nonovel/query";

import { getURL } from "~/lib/string";
import "../../../globals.css";

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

  console.log(`Request to ${reqURL}`);

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

  return (
    <>
      <div className="m-0 flex h-[900px] w-[600px] flex-col items-center justify-center bg-[#B5A38E] p-7 text-center font-bold leading-tight text-black">
        <div className="relative h-full w-full flex-1">
          <img
            className="absolute h-full w-full rounded-md object-cover"
            src={`data:image/jpeg;base64,${data.background}`}
          />
          <h3 className="font-xl absolute bottom-0 right-0 m-2 rounded-md bg-white p-3 font-sans opacity-50">
            NoNovel.io
          </h3>
        </div>
        <h1 className="my-4 font-serif text-5xl">{data.project.name}</h1>
        <h2 className="m-0 font-serif text-4xl uppercase">
          {data.project.penName}
        </h2>
      </div>
    </>
  );
}
