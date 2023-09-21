import { NextResponse } from "next/server";
import { headers } from "next/headers";

import config from "@nonovel/config-server";
import { getProjectById } from "@nonovel/query";
import { chainProjectCover } from "@nonovel/ai";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const auth = headersList.get("Authorization");

    if (!auth || auth !== `Bearer ${config.NB_GEN_SECRET_KEY}`)
      throw new Error("Unauthorized");

    const res = (await request.json()) as { id: string };

    const [projectErr, project] = await getProjectById({ id: res.id });

    if (projectErr || !project || !project.penName)
      throw new Error("Project not found");

    const coverBackgroundBase64 = await chainProjectCover({
      title: project.name,
      author: project.penName,
    });

    if (!coverBackgroundBase64)
      throw new Error("AI failed to generate background");

    return NextResponse.json({
      success: true,
      data: { project, background: coverBackgroundBase64 },
    });
  } catch (e) {
    if (e instanceof Error)
      console.log(`Failed to generate the cover: ${e.message}`);
    return NextResponse.json({
      success: false,
      data: null,
    });
  }
}
