"use client";

import { useState } from "react";
import Colorful from "@uiw/react-color-colorful";
import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

interface ColorChangeProps {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  label: string;
  defaultHexColors: {
    light: string;
    dark: string;
  };
}

export const ColorChange = ({
  value: parentValue,
  setValue: setParentValue,
  label,
  defaultHexColors,
}: ColorChangeProps) => {
  const { theme } = useTheme();
  const [localValue, setLocalValue] = useState(parentValue);

  const localHexColor =
    localValue !== "inherit"
      ? localValue
      : theme === "light"
      ? defaultHexColors.light
      : defaultHexColors.dark;

  const parentHexColor =
    parentValue !== "inherit"
      ? parentValue
      : theme === "light"
      ? defaultHexColors.light
      : defaultHexColors.dark;

  const setValue = (hex: string) => {
    if (hex.charAt(0) !== "#") {
      setLocalValue("#" + hex);
      return;
    }

    setLocalValue(hex);

    if (hex.length < 4 || !hex.includes("#")) {
      setParentValue(
        theme === "light" ? defaultHexColors.light : defaultHexColors.dark
      );
      return;
    }
    setParentValue(hex);
  };

  return (
    <Dialog>
      <DialogTrigger className="flex flex-col items-center justify-center w-full gap-1 px-4 py-2 text-sm rounded-md nn-interactive bg-nn-secondary">
        {label}
        <div
          style={{
            backgroundColor: parentHexColor,
          }}
          className="w-full rounded-full py-[.35rem]"
        />
      </DialogTrigger>
      <DialogContent className="w-auto min-w-[300px] p-8">
        <Colorful
          color={localHexColor}
          style={{ width: "100%" }}
          className="[&>*]:z-auto [&>*]:ring-0"
          onChange={({ hexa }) => setValue(hexa)}
        />
        <Input
          value={localHexColor}
          className="bg-nn-secondary"
          onChange={(e) => setValue(e.target.value)}
        />

        <div
          style={{
            backgroundColor: parentHexColor,
          }}
          className="w-full py-12 border rounded-md nn-border"
        />
      </DialogContent>
    </Dialog>
  );
};
