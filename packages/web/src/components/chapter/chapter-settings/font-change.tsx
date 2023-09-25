"use client";

import { type Dispatch, type SetStateAction } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface FontChangeProps {
  font: string;
  setFont: Dispatch<SetStateAction<string | undefined>>;
  allowedFonts: { name: string; font: string }[];
}

export const FontChange = ({
  font,
  setFont,
  allowedFonts,
}: FontChangeProps) => {
  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${allowedFonts.length}, minmax(0, 1fr))`,
      }}
    >
      {allowedFonts.map((f) => (
        <Button
          key={f.font}
          variant="ghost"
          className={cn(
            f.font === font ? "bg-nn-accent" : "bg-nn-secondary",
            "nn-border border text-xs"
          )}
          style={{ fontFamily: f.font }}
          onClick={() => setFont(f.font)}
          title="Change font"
        >
          {f.name}
        </Button>
      ))}
    </div>
  );
};
