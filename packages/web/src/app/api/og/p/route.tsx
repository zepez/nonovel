/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";
import config from "@nonovel/config-client";

export const runtime = "edge";

export function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const hasTitle = searchParams.has("title");
    const title = hasTitle ? searchParams.get("title")?.slice(0, 100) : null;

    const hasImage = searchParams.has("image");
    const image = hasImage ? searchParams.get("image") : "";
    const imageSrc = image
      ? `https://${config.NEXT_PUBLIC_S3_DOMAIN}/${image}`
      : null;

    if (!title || !imageSrc) throw new Error("Missing required data");

    const hasChapter = searchParams.get("chapter") ?? null;
    const chapter = hasChapter ? searchParams.get("chapter") : null;

    return new ImageResponse(
      (
        <div
          tw="relative flex flex-row items-center justify-center text-white font-sans overflow-hidden"
          style={{
            width: 1200,
            height: 630,
            textShadow:
              "1px 1px 3px rgba(0, 0, 0, 0.7), 1px 1px 2px rgba(0, 0, 0, 0.7)",
          }}
        >
          <img
            src={imageSrc}
            alt={title ?? "NoNovel.io"}
            tw="absolute top-0 left-0 w-full h-full"
            style={{
              objectFit: "cover",
              filter: "blur(30px) grayscale(25%) brightness(0.5)",
              zIndex: "-1",
            }}
          />
          <img
            src={imageSrc}
            alt={title ?? "NoNovel.io"}
            width={350}
            height={500}
            tw="bg-nn-light rounded-sm mx-12"
            style={{
              objectFit: "contain",
              border: "10px solid white",
            }}
          />
          <div tw="flex flex-col min-h-screen py-20" style={{ width: 500 }}>
            <div tw="flex flex-col leading-tight">
              <p tw="m-0 text-6xl">{title}</p>
            </div>
            <div tw="flex flex-grow items-center">
              {chapter && <p tw="m-0 text-5xl">{chapter}</p>}
            </div>
            <div tw="flex items-center text-3xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="32.275391"
                height="30.46875"
                fill="white"
                style={{ marginRight: "1rem" }}
              >
                <defs id="defs3039" />
                <g id="g3065">
                  <g
                    id="text3035"
                    style={{ fontSize: "100px", fontFamily: "arial" }}
                  >
                    <path
                      d="M 0,14.355469 2.2460938,7.421875 C 7.4218645,9.2448552 11.181626,10.82363 13.525391,12.158203 12.906885,6.2663426 12.581365,2.2136123 12.548828,0 l 7.080078,0 c -0.09768,3.2227258 -0.472027,7.2591801 -1.123047,12.109375 3.35284,-1.692646 7.193982,-3.2551444 11.523438,-4.6875 l 2.246094,6.933594 c -4.134146,1.367244 -8.186877,2.278702 -12.158204,2.734375 1.985652,1.725314 4.785129,4.801483 8.398438,9.228515 L 22.65625,30.46875 C 20.768205,27.89718 18.53839,24.397835 15.966797,19.970703 13.557926,24.560595 11.442043,28.059941 9.6191406,30.46875 L 3.8574219,26.318359 C 7.6334528,21.663463 10.335273,18.587294 11.962891,17.089844 7.763661,16.276098 3.7760348,15.364641 0,14.355469"
                      id="path3063"
                      style={{ fontSize: "100px", fontFamily: "arial" }}
                    />
                  </g>
                </g>
              </svg>
              nonovel.io
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    if (e instanceof Error) console.log(`${e.message}`);
    return new Response("Failed to generate the image", {
      status: 500,
    });
  }
}
