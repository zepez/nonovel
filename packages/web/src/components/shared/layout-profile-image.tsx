"use client";

import Avatar from "boring-avatars";
import { cn } from "~/lib";

interface LayoutProfileProps {
  className?: string;
  seed?: string | null;
  size: number;
}

export const LayoutProfileImage = ({
  className,
  seed,
  size,
}: LayoutProfileProps) => {
  return (
    <div
      className={cn(
        "bg-nn-base-invert overflow-hidden rounded-md border border-nn-base-dark dark:border-nn-base-light",
        className
      )}
    >
      <Avatar
        size={size}
        name={seed ? seed : Math.random().toString()}
        variant="beam"
        square={true}
        colors={["#382419", "#f0b557"]}
      />
    </div>
  );
};
