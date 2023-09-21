"use client";

import Github from "@uiw/react-color-github";
import { useTheme } from "next-themes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface ColorChangeProps {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
  defaultSemanticColors: {
    light: string;
    dark: string;
  };
}

export const ColorChange = ({
  value,
  setValue,
  label,
  defaultSemanticColors,
}: ColorChangeProps) => {
  const { theme } = useTheme();

  const semanticColor =
    value !== "inherit"
      ? value
      : theme === "light"
      ? defaultSemanticColors.light
      : defaultSemanticColors.dark;

  return (
    <Popover>
      <PopoverTrigger className="nn-interactive nn-bg-background nn-border-50 flex w-full flex-col items-center justify-center gap-1 rounded-md border p-1 text-[0.90rem]">
        {label}
        <div
          style={{
            backgroundColor: semanticColor,
          }}
          className="nn-border-50 mx-2 w-full rounded-sm border p-1"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1">
        <Github
          color={semanticColor}
          style={{ width: 212 }}
          onChange={({ hex }) => setValue(hex)}
        />
      </PopoverContent>
    </Popover>
  );
};
