"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { ClientOnly } from "~/components/shared";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  darkChildren: React.ReactNode;
  lightChildren: React.ReactNode;
}

export function ThemeSwitcher({
  className,
  darkChildren,
  lightChildren,
}: ThemeSwitcherProps) {
  const { setTheme, theme } = useTheme();

  return (
    <ClientOnly>
      {theme === "light" || theme === "system" || !theme ? (
        <Button
          variant="ghost"
          className={cn(
            "text-md block h-auto w-full justify-start rounded-none px-0 py-2 text-left font-normal",
            className
          )}
          onClick={() => setTheme("dark")}
        >
          {darkChildren}
        </Button>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            "text-md block h-auto w-full justify-start rounded-none px-0 py-2 text-left font-normal",
            className
          )}
          onClick={() => setTheme("light")}
        >
          {lightChildren}
        </Button>
      )}
    </ClientOnly>
  );
}
