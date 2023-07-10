"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useLocalStorage } from "react-use";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";

const defaultSettings = {
  fontSize: 24,
  leading: 1.5,
  paragraphSpacing: 2,
};

interface IncrementalChangeProps {
  name: string;
  stored: typeof defaultSettings;
  storedKey: keyof typeof defaultSettings;
  setStored: Dispatch<SetStateAction<typeof defaultSettings | undefined>>;
  increment: number;
  min: number;
  max: number;
}

const IncrementalChange = ({
  name,
  stored,
  storedKey,
  increment,
  setStored,
  min,
  max,
}: IncrementalChangeProps) => {
  const setStoredKey = (
    storedKey: keyof typeof defaultSettings,
    value: number | string
  ) => {
    setStored(() => {
      if (stored) return { ...stored, [storedKey]: value };

      return { ...defaultSettings, [storedKey]: value };
    });
  };

  return (
    <div className="flex items-center justify-between w-full mb-4 select-none">
      <Button
        variant="outline"
        disabled={stored[storedKey] <= min}
        onClick={() => setStoredKey(storedKey, stored[storedKey] - increment)}
      >
        -
      </Button>
      <p className="text-xs">
        {name}: {stored[storedKey]}
      </p>
      <Button
        variant="outline"
        disabled={stored[storedKey] >= max}
        onClick={() => setStoredKey(storedKey, stored[storedKey] + increment)}
      >
        +
      </Button>
    </div>
  );
};

interface ChapterSettingsProps {
  className?: string;
}

export const ChapterSettings = ({ className }: ChapterSettingsProps) => {
  const [stored, setStored] = useLocalStorage<typeof defaultSettings>(
    "read-chapter-settings",
    defaultSettings
  );

  useEffect(() => {
    if (!stored) return;

    // font size
    document.documentElement.style.setProperty(
      "--chapter-text-size",
      `${stored.fontSize ?? defaultSettings.fontSize}px`
    );
    // leading
    document.documentElement.style.setProperty(
      "--chapter-leading",
      stored.leading?.toString() ?? defaultSettings.leading.toString()
    );
    // paragraph spacing
    document.documentElement.style.setProperty(
      "--chapter-paragraph-spacing",
      `${
        stored.paragraphSpacing?.toString() ??
        defaultSettings.paragraphSpacing.toString()
      }rem 0rem`
    );
  }, [stored]);

  if (!stored) return null;

  return (
    <>
      <Popover>
        <PopoverTrigger className={cn(className)}>
          <MixerHorizontalIcon
            className="hidden m-2 md:block"
            width="32"
            height="32"
          />
          <div className="flex text-xs md:hidden">
            <MixerHorizontalIcon className="mr-2" width="16" height="16" />
            Text settings
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <IncrementalChange
            name="Font Size"
            storedKey="fontSize"
            increment={1}
            stored={stored}
            setStored={setStored}
            min={12}
            max={48}
          />
          <IncrementalChange
            name="Line Height"
            storedKey="leading"
            increment={0.25}
            stored={stored}
            setStored={setStored}
            min={1}
            max={6}
          />
          <IncrementalChange
            name="Paragraph Spacing"
            storedKey="paragraphSpacing"
            increment={0.25}
            stored={stored}
            setStored={setStored}
            min={1}
            max={6}
          />

          <Button
            size="sm"
            className="w-full h-8 text-xs font-bold leading-tight uppercase"
            variant="contrast"
            onClick={() => setStored(defaultSettings)}
          >
            Reset
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
};
