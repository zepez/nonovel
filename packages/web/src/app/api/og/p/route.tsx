/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";
import config from "@nonovel/config-client";
import { db } from "@nonovel/db";

export const runtime = "edge";

const fetchBaskervville = fetch(
  new URL(
    "../../../../../public/fonts/baskervville-italic.ttf",
    import.meta.url
  )
).then((res) => res.arrayBuffer());

const fetchMontserrat = fetch(
  new URL("../../../../../public/fonts/montserrat-bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    if (!id) throw new Error("Missing required project id");

    const project = await db.query.project.findFirst({
      where: (project, { eq }) => eq(project.id, id),
    });
    if (!project) throw new Error("Project not found");

    const cover = project?.cover
      ? `https://${config.NEXT_PUBLIC_S3_DOMAIN}/${project.cover}`
      : "";

    const baskervville = await fetchBaskervville;
    const montserrat = await fetchMontserrat;

    const padding = 20;
    const wrapperHeight = 630;
    const wrapperWidth = 1200;

    const innerHeight = wrapperHeight - padding * 2;
    const innerWidth = wrapperWidth - padding * 2;
    const innerGap = 40;

    const innerLeftWidth = (innerHeight / 3) * 2;
    const innerRightWidth = innerWidth - innerLeftWidth - innerGap;

    return new ImageResponse(
      (
        <div
          style={{
            width: wrapperWidth,
            height: wrapperHeight,
            display: "flex",
            flexWrap: "wrap",
            backgroundColor: "#20130d",
            color: "#f5e1c9",
            position: "relative",
            padding,
          }}
        >
          <img
            src={cover}
            tw="absolute top-0 left-0 w-full h-full"
            style={{
              width: wrapperWidth,
              height: wrapperHeight,
              objectFit: "fill",
              filter: "blur(50px) saturate(1) brightness(0.5)",
              zIndex: -1,
              maskImage: "linear-gradient(to left, transparent, black 30%)",
            }}
          />
          <div
            style={{
              width: innerLeftWidth + innerGap,
              height: innerHeight,
              display: "flex",
            }}
          >
            <img
              src={cover}
              style={{
                width: innerLeftWidth,
                height: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
              }}
            />
          </div>
          <div
            style={{
              width: innerRightWidth,
              height: innerHeight,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                fontSize: "90px",
                fontFamily: "baskervville",
                lineHeight: "85px",
                margin: 0,
                padding: 0,
                marginLeft: -5,
              }}
            >
              {project.name}
            </p>
            <p
              style={{
                fontSize: "30px",
              }}
            >
              {project.penName}
            </p>
            <div
              style={{
                flexGrow: "1",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", flexGrow: 1 }} />
              <svg
                version="1.2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 578 134"
                height="60"
              >
                <path
                  id="Layer"
                  className="s0"
                  fill="#de970b"
                  d="m6.3 128.2v-5.3c13.9-1.3 17.8-3.8 17.8-19.4v-71.1q-0.1-1.1-0.3-2.1-0.2-1.1-0.6-2-0.4-1-1-1.9-0.6-0.9-1.3-1.7c-4.1-4.2-6.8-5-16.4-6v-5.4h29l70.9 91.4v-65.4c0-16.7-2-19-20.2-20.6v-5.4h44.8v5.4c-15 1-17.5 5-17.5 20.4v71.5q0 2.2 0 4.5 0 2.3 0.1 4.6 0 2.2 0.2 4.5 0.1 2.3 0.3 4.5h-11.6c-2.5-3.7-7.1-10.1-11.2-15.5l-57.9-77.1v67.3c0 15.9 3.7 18 19.8 19.5v5.3z"
                />
                <path
                  id="Layer"
                  className="s0"
                  fill="#de970b"
                  d="m205.7 128.2v-5.3c10.7-0.6 12.3-1.8 12.3-8v-40.8c0-3.3-0.2-8.4-0.6-9.7-0.3-1.4-3.3-4.1-9.2-6v-3.8q3-0.6 6.1-1.4 3-0.8 5.9-1.7 3-1 5.9-2.1 2.9-1.1 5.8-2.4l1.2 0.7c-0.2 2.7-0.5 8.4-0.5 11.4 8-8.2 16.5-12.1 25.6-12.1q2.3 0 4.5 0.4 2.2 0.4 4.3 1.2 2.1 0.8 4.1 2 1.9 1.3 3.5 2.8c5.9 5.7 7.7 13.9 7.7 22.1v39.4c0 6.4 1.6 7.3 10.8 8v5.3h-39v-5.3c10.5-1.1 12.5-0.9 13.2-6.6 0.2-2 0.4-4.7 0.4-8.4v-33.3c0-5.3-0.7-10-4.8-14.1-3.6-3.5-9.1-4.1-12.5-4.1-4.3 0-10.5 2.2-13.7 5.2-3.4 3.4-4.1 4.6-4.1 12.8v40.4c0 6.5 1.6 7.3 11.7 8v5.4z"
                />
                <path
                  id="Layer"
                  fillRule="evenodd"
                  className="s0"
                  fill="#de970b"
                  d="m366.5 59.1c6.4 7.1 10.5 17.8 10.5 28.9 0 13.2-4.6 23.1-11.9 30.8q-2.7 2.7-5.8 4.8-3.1 2.2-6.6 3.7-3.5 1.5-7.2 2.2-3.7 0.8-7.5 0.8c-11.6 0-21.5-3.9-28.7-11.4-7.6-7.8-11.7-18.8-11.7-30.4 0-15.9 7.3-27.1 17.4-34.4q2.5-1.7 5.3-3.1 2.7-1.3 5.7-2.2 2.9-0.9 5.9-1.4 3-0.4 6.1-0.4c11.8 0 21.5 4.4 28.5 12.1zm-12.8 57.9c3.9-5.7 6.2-16 6.2-27.6 0-11.6-2.5-21.4-7.6-28.3-4.2-5.2-9.7-8.4-16.1-8.4-12.1 0-21.5 9.1-21.5 33.3 0 11.2 2 22.3 8 30.3q1.4 1.8 3.2 3.3 1.8 1.5 3.9 2.6 2.1 1 4.3 1.5 2.3 0.6 4.6 0.6c5.9 0 11.4-1.8 15-7.3z"
                />
                <path
                  id="Layer"
                  className="s0"
                  fill="#de970b"
                  d="m376.1 49.1h37.8v5.4q-1.1 0-2.2 0.2-1.1 0.1-2.2 0.2-1.1 0.2-2.2 0.4-1.1 0.2-2.2 0.4c-2.3 0.7-3.2 1.6-2.1 4.7 3.5 11 15 41.1 17.8 49.1 4.8-12.1 15.7-37.9 19.1-47.7 1.2-3.8 0.7-5.2-2.5-5.9-2.4-0.5-6.6-1.1-10-1.4v-5.4h32.4v5.4c-7.7 0.7-9.6 2-12.1 7.3-6.2 13.7-24.9 57-29.2 67.8h-5.4c-3-10.5-19-52.2-25.1-67.8-2.5-6.3-4.4-6.6-11.9-7.3z"
                />
                <path
                  id="Layer"
                  fillRule="evenodd"
                  className="s0"
                  fill="#de970b"
                  d="m528.1 112.9c-7.1 10.7-17.6 17.4-32.4 17.4-11.8 0-22.1-5.7-27.8-13.7-5.2-7.3-8-16.4-8-26.9 0-16.2 7.5-29 17.3-36.3 5.8-4.4 14.2-6.4 20.4-6.4 20.9 0 30.7 16 30.7 29.6 0 4.2-0.6 6.7-1.6 7-4.8 0.5-35.7 0.5-50.4 0.5q-0.1 0.4-0.1 0.7 0 0.4-0.1 0.8 0 0.4 0 0.7 0 0.4 0 0.8c0 12.5 2.8 21.2 8.4 27.1q1.6 1.7 3.7 3.1 2 1.4 4.2 2.3 2.3 0.9 4.7 1.3 2.4 0.5 4.8 0.4c7.5 0 15.7-2.7 23-11.8zm-20.3-34.7c4.8-0.4 5.4-2.3 5.4-6.4 0-7-4.5-19.4-17.3-19.4-8.9 0-17.7 7.8-19.3 26.3 14.1 0 25-0.2 31.2-0.5z"
                />
                <path
                  id="Layer"
                  className="s0"
                  fill="#de970b"
                  d="m536.4 128.2v-5.3c10.3-0.8 11-2.4 11-8.2v-87.8c0-6.3-0.2-8.2-0.7-9.7-0.4-1.4-3.7-5-10.9-6.5v-4.5c7.2-0.4 18.9-2.9 26.6-5.5l0.7 0.5c-0.4 2.9-0.9 11.2-0.9 16.6v97.2c0 5.7 0.9 7.3 11.4 8v5.2z"
                />
                <path
                  id="Layer"
                  className="s1"
                  fill="#f5e1c9"
                  d="m204.1 84.8c-1.4-10.3-4.1-9.9-4.1-9.9l-33.3 11.1 15.3-32.8c0 0 0.7-2.4-9-5.2-10-2.8-10.7-0.2-10.7-0.2l-3.6 35.9-22.8-26.9c0 0-2.1-1.7-8.7 6.3-6.3 7.8-4.3 9.4-4.3 9.4l31.8 17.9-32.6 14.4c0 0-2.2 1.5 3.7 10 5.7 8.3 7.8 6.8 7.8 6.8l25.8-25.5 8.7 35.3c0 0 1 2.2 10.2-1.8 9.5-4.2 8.4-6.6 8.4-6.6l-20.2-29.3 36.4 1.3c0 0 2.5-0.3 1.2-10.2z"
                />
              </svg>
            </div>
            <p style={{ fontSize: 20, margin: 0 }}>
              Escape Reality. Read a book.
            </p>
            <p style={{ borderTop: "1px solid #f5e1c9", paddingTop: 10 }}>
              https://nonovel.io/read/{project.slug}
            </p>
          </div>
        </div>
      ),
      {
        width: wrapperWidth,
        height: wrapperHeight,
        fonts: [
          {
            name: "montserrat",
            data: montserrat,
            style: "normal",
          },
          {
            name: "baskervville",
            data: baskervville,
            style: "italic",
          },
        ],
      }
    );
  } catch (e) {
    if (e instanceof Error) console.log(`${e.message}`);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
