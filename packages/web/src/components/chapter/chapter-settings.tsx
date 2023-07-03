"use client";

import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import { GearIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";

export const ChapterSettings = () => {
  const defaultSettings = {
    fontSize: 24,
    leading: 1.5,
  };

  const [stored, setStored] = useLocalStorage<typeof defaultSettings>(
    "read-chapter-settings",
    defaultSettings
  );

  useEffect(() => {
    if (!stored) return;

    // font size
    document.documentElement.style.setProperty(
      "--chapter-text-size",
      `${stored.fontSize}px`
    );
    // leading
    document.documentElement.style.setProperty(
      "--chapter-leading",
      stored.leading.toString()
    );
  }, [stored]);

  const setStoredKey = (
    key: keyof typeof defaultSettings,
    value: number | string
  ) => {
    setStored((s) => {
      if (s) return { ...s, [key]: value };

      return { ...defaultSettings, [key]: value };
    });
  };

  if (!stored) return null;

  return (
    <>
      <Popover>
        <PopoverTrigger className="nn-bg-primary mt-4 flex h-12 w-full items-center justify-center rounded-md sm:mt-0 sm:w-12">
          <GearIcon className="m-2" width="32" height="32" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex w-full select-none items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStoredKey("fontSize", stored.fontSize - 1)}
            >
              -
            </Button>
            <p>Font Size: {stored.fontSize}</p>
            <Button
              variant="outline"
              onClick={() => setStoredKey("fontSize", stored.fontSize + 1)}
            >
              +
            </Button>
          </div>

          <div className="mt-4 flex w-full select-none items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setStoredKey("leading", stored.leading - 0.25)}
            >
              -
            </Button>
            <p>Line Height: {stored.leading}</p>
            <Button
              variant="outline"
              onClick={() => setStoredKey("leading", stored.leading + 0.25)}
            >
              +
            </Button>
          </div>

          <Button
            size="sm"
            className="mt-4 h-8 w-full text-xs"
            onClick={() => setStored(defaultSettings)}
          >
            Reset
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
};
