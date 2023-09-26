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
    <div className="flex flex-wrap justify-evenly gap-3">
      {allowedFonts.map((f) => (
        <Button
          key={f.font}
          variant="ghost"
          className={cn(
            f.font === font ? "bg-nn-accent" : "bg-nn-secondary",
            "flex-grow basis-0 text-sm"
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
