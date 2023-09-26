"use client";

import { useEffect } from "react";
import { useLocalStorage } from "react-use";
import * as z from "zod";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { IncrementalChange } from "./incremental-change";
import { FontChange } from "./font-change";
import { ColorChange } from "./color-change";

const fontSizeValidator = z.number().min(12).max(48).default(24);
const fontValidator = z.string().default("sans-serif");
const leadingValidator = z.number().min(1).max(4).default(1.5);
const paragraphSpacingValidator = z.number().min(2).max(10).default(2);
const letterSpacingValidator = z.number().min(0).max(8).default(0);
const textColorValidator = z.string().default("inherit");
const backgroundColorValidator = z.string().default("inherit");

interface ChapterSettingsProps {
  triggerText?: string;
  className?: string;
}

export const ChapterSettings = ({
  className,
  triggerText,
}: ChapterSettingsProps) => {
  const defaultFontSize = fontSizeValidator.parse(undefined);
  const [fontSize, setFontSize] = useLocalStorage(
    "nn-chapter-font-size",
    defaultFontSize
  );

  const defaultFont = fontValidator.parse(undefined);
  const [font, setFont] = useLocalStorage("nn-chapter-font", defaultFont);

  const defaultLeading = leadingValidator.parse(undefined);
  const [leading, setLeading] = useLocalStorage(
    "nn-chapter-leading",
    defaultLeading
  );

  const defaultParagraphSpacing = paragraphSpacingValidator.parse(undefined);
  const [paragraphSpacing, setParagraphSpacing] = useLocalStorage(
    "nn-chapter-paragraph-spacing",
    defaultParagraphSpacing
  );

  const defaultLetterSpacing = letterSpacingValidator.parse(undefined);
  const [letterSpacing, setLetterSpacing] = useLocalStorage(
    "nn-chapter-letter-spacing",
    defaultLetterSpacing
  );

  const defaultTextColor = textColorValidator.parse(undefined);
  const [textColor, setTextColor] = useLocalStorage(
    "nn-chapter-text-color",
    defaultTextColor
  );

  const defaultBackgroundColor = backgroundColorValidator.parse(undefined);
  const [backgroundColor, setBackgroundColor] = useLocalStorage(
    "nn-chapter-background-color",
    defaultBackgroundColor
  );

  const resetToDefaults = () => {
    setFontSize(defaultFontSize);
    setFont(defaultFont);
    setLeading(defaultLeading);
    setParagraphSpacing(defaultParagraphSpacing);
    setLetterSpacing(defaultLetterSpacing);
    setTextColor(defaultTextColor);
    setBackgroundColor(defaultBackgroundColor);
  };

  useEffect(() => {
    if (
      !fontSize ||
      !font ||
      !leading ||
      !paragraphSpacing ||
      letterSpacing === undefined ||
      !textColor ||
      !backgroundColor
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

    document.documentElement.style.setProperty(
      "--chapter-text-color",
      textColor
    );

    document.documentElement.style.setProperty(
      "--chapter-background-color",
      backgroundColor
    );
  }, [
    fontSize,
    font,
    leading,
    paragraphSpacing,
    letterSpacing,
    textColor,
    backgroundColor,
  ]);

  if (
    !fontSize ||
    !font ||
    !leading ||
    !paragraphSpacing ||
    letterSpacing === undefined ||
    !textColor ||
    !backgroundColor
  )
    return null;

  return (
    <>
      <Dialog>
        <DialogTrigger className={cn(className)} title="Chapter settings">
          <MixerHorizontalIcon width={22} height={22} /> {triggerText}
        </DialogTrigger>
        <DialogContent className="nn-bg-dark flex w-screen flex-col gap-5 p-8 sm:w-[400px]">
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

          <div className="flex items-center justify-around gap-3 rounded-md">
            <ColorChange
              value={textColor}
              setValue={setTextColor}
              label="Text Color"
              defaultSemanticColors={{
                light: "#000000",
                dark: "#ffffff",
              }}
            />
            <ColorChange
              value={backgroundColor}
              setValue={setBackgroundColor}
              label="Background Color"
              defaultSemanticColors={{
                light: "#ffffff",
                dark: "#121212",
              }}
            />
          </div>

          <Button
            size="sm"
            className="mt-0 h-8 w-full text-xs font-bold uppercase leading-tight"
            variant="secondary"
            onClick={resetToDefaults}
            title="Reset to defaults"
          >
            Reset
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
