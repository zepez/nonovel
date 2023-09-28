"use client";

import { useEffect, useState } from "react";

import { cn } from "~/lib";
import { FullLogoLight, FullLogoDark } from "~/components/brand";

interface Props {
  className?: string;
  inferColorColorFrom: "top" | "bottom";
}

export const Watermark = ({ className, inferColorColorFrom }: Props) => {
  const [logoStyle, setLogoStyle] = useState<"light" | "dark">("light");

  const img =
    typeof document === "undefined"
      ? null
      : (document.querySelector("#background") as HTMLImageElement);

  // calculate luminance of background image
  useEffect(() => {
    if (!img?.complete) return;

    // Create a canvas and draw the image onto it
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Define the region you want to analyze. For example, a 100x100 square from the center of the image.
    const startX = (img.width - 100) / 2;
    const startY = inferColorColorFrom === "top" ? 0 : img.height - 100;
    const width = 100;
    const height = 100;

    // Get the image data for that region
    const imageData = ctx.getImageData(startX, startY, width, height).data;

    // Compute average color from that region
    let r = 0,
      g = 0,
      b = 0;
    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }
    r /= width * height;
    g /= width * height;
    b /= width * height;

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    console.log({ luminance });
    setLogoStyle(luminance > 0.7 ? "dark" : "light");
  }, [img?.complete]);

  return (
    <div
      className={cn(className, "absolute left-0 flex w-full justify-center")}
    >
      <div className="rounded-sm p-2 backdrop-blur-xl backdrop-brightness-75">
        {logoStyle === "light" ? <FullLogoLight /> : <FullLogoDark />}
      </div>
    </div>
  );
};
