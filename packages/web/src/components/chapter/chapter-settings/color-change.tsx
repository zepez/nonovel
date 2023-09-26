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
      <PopoverTrigger className="nn-interactive bg-nn-secondary flex w-full flex-col items-center justify-center gap-1 rounded-md px-4 py-2 text-sm">
        {label}
        <div
          style={{
            backgroundColor: semanticColor,
          }}
          className="w-full rounded-full py-[.35rem]"
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
