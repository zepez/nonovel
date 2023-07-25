"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useLocalStorage } from "react-use";
import * as z from "zod";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { Separator } from "~/components/ui/separator";

const fontSizeValidator = z.number().min(12).max(48).default(24);
const fontValidator = z.string().default("sans-serif");
const leadingValidator = z.number().min(1).max(4).default(1.5);
const paragraphSpacingValidator = z.number().min(2).max(10).default(2);
const letterSpacingValidator = z.number().min(0).max(8).default(0);

interface IncrementalChangeProps {
  name: string;
  value: string | number;
  setValue: Dispatch<SetStateAction<number | undefined>>;
  step: number;
  min: number;
  max: number;
  showSlider?: boolean;
}

const IncrementalChange = ({
  name,
  value,
  setValue,
  step,
  min,
  max,
  showSlider = false,
}: IncrementalChangeProps) => {
  const numberValue = typeof value === "string" ? parseInt(value) : value;

  return (
    <div>
      <div className="flex w-full select-none items-baseline justify-between">
        <Button
          variant="secondary"
          size="fluid"
          className="nn-border-50 flex h-0 items-center justify-center py-3"
          disabled={numberValue <= min}
          onClick={() => setValue(numberValue - step)}
        >
          -
        </Button>
        <p className="text-[.7rem]">
          {name}: {value}
        </p>
        <Button
          variant="secondary"
          size="fluid"
          className="nn-border-50 flex h-0 items-center justify-center py-3"
          disabled={numberValue >= max}
          onClick={() => setValue(numberValue + step)}
        >
          +
        </Button>
      </div>
      {showSlider && (
        <Slider
          value={[numberValue]}
          max={max}
          min={min}
          step={step}
          onValueChange={(v) => setValue(v[0])}
          className="mt-4"
        />
      )}
    </div>
  );
};

interface FontChangeProps {
  font: string;
  setFont: Dispatch<SetStateAction<string | undefined>>;
  allowedFonts: { name: string; font: string }[];
}

const FontChange = ({ font, setFont, allowedFonts }: FontChangeProps) => {
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
            f.font === font ? "nn-bg-primary" : "nn-bg-background",
            "text-xs"
          )}
          style={{ fontFamily: f.font }}
          onClick={() => setFont(f.font)}
        >
          {f.name}
        </Button>
      ))}
    </div>
  );
};

interface ChapterSettingsProps {
  className?: string;
}

export const ChapterSettings = ({ className }: ChapterSettingsProps) => {
  const defaultFontSize = fontSizeValidator.parse(undefined);
  const [fontSize, setFontSize] = useLocalStorage("font-size", defaultFontSize);

  const defaultFont = fontValidator.parse(undefined);
  const [font, setFont] = useLocalStorage("font", defaultFont);

  const defaultLeading = leadingValidator.parse(undefined);
  const [leading, setLeading] = useLocalStorage("leading", defaultLeading);

  const defaultParagraphSpacing = paragraphSpacingValidator.parse(undefined);
  const [paragraphSpacing, setParagraphSpacing] = useLocalStorage(
    "paragraph-spacing",
    defaultParagraphSpacing
  );

  const defaultLetterSpacing = letterSpacingValidator.parse(undefined);
  const [letterSpacing, setLetterSpacing] = useLocalStorage(
    "letter-spacing",
    defaultLetterSpacing
  );

  const resetToDefaults = () => {
    setFontSize(defaultFontSize);
    setFont(defaultFont);
    setLeading(defaultLeading);
    setParagraphSpacing(defaultParagraphSpacing);
    setLetterSpacing(defaultLetterSpacing);
  };

  useEffect(() => {
    if (
      !fontSize ||
      !font ||
      !leading ||
      !paragraphSpacing ||
      letterSpacing === undefined
    )
      return;

    document.documentElement.style.setProperty(
      "--chapter-text-size",
      `${fontSize}px`
    );

    document.documentElement.style.setProperty("--chapter-font", font);

    document.documentElement.style.setProperty(
      "--chapter-leading",
      leading.toString()
    );

    document.documentElement.style.setProperty(
      "--chapter-paragraph-spacing",
      `${paragraphSpacing.toString()}rem 0rem`
    );

    document.documentElement.style.setProperty(
      "--chapter-letter-spacing",
      `${letterSpacing.toString()}px`
    );
  }, [fontSize, font, leading, paragraphSpacing, letterSpacing]);

  if (
    !fontSize ||
    !font ||
    !leading ||
    !paragraphSpacing ||
    letterSpacing === undefined
  )
    return null;

  return (
    <>
      <Popover>
        <PopoverTrigger className={cn(className)}>
          <MixerHorizontalIcon
            className="m-2 hidden md:block"
            width="32"
            height="32"
          />
          <div className="flex text-xs md:hidden">
            <MixerHorizontalIcon className="mr-2" width="16" height="16" />
            Text settings
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="nn-bg-foreground nn-border flex w-screen flex-col gap-5 border sm:w-[400px]"
        >
          <IncrementalChange
            name="Font Size"
            value={fontSize}
            setValue={setFontSize}
            step={2}
            min={12}
            max={48}
            showSlider
          />
          <FontChange
            font={font}
            setFont={setFont}
            allowedFonts={[
              {
                name: "Default",
                font: "sans-serif",
              },
              {
                name: "Mono",
                font: "PT Mono",
              },
              {
                name: "Dyslexic",
                font: "open-dyslexic",
              },
            ]}
          />
          <Separator />
          <IncrementalChange
            name="Line Height"
            value={leading}
            setValue={setLeading}
            step={0.25}
            min={1}
            max={4}
          />
          <IncrementalChange
            name="Paragraph Spacing"
            value={paragraphSpacing}
            setValue={setParagraphSpacing}
            step={0.5}
            min={2}
            max={10}
          />
          <IncrementalChange
            name="Letter Spacing"
            value={letterSpacing}
            setValue={setLetterSpacing}
            step={1}
            min={0}
            max={8}
          />

          <Button
            size="sm"
            className="mt-4 h-8 w-full text-xs font-bold uppercase leading-tight"
            variant="contrast"
            onClick={resetToDefaults}
          >
            Reset
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
};
