"use client";

import { type Dispatch, type SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";

interface IncrementalChangeProps {
  name: string;
  value: string | number;
  setValue: Dispatch<SetStateAction<number | undefined>>;
  step: number;
  min: number;
  max: number;
  showSlider?: boolean;
}

export const IncrementalChange = ({
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
          className="nn-border-50 flex h-0 items-center justify-center border py-3"
          disabled={numberValue <= min}
          onClick={() => setValue(numberValue - step)}
          title={`Decrease ${name.toLowerCase()}`}
        >
          -
        </Button>
        <p className="text-[0.95rem]">
          {name}: {value}
        </p>
        <Button
          variant="secondary"
          size="fluid"
          className="nn-border-50 flex h-0 items-center justify-center border py-3"
          disabled={numberValue >= max}
          onClick={() => setValue(numberValue + step)}
          title={`Increase ${name.toLowerCase()}`}
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
