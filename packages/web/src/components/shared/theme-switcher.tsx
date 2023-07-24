"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";

interface ThemeSwitcherProps {
  className?: string;
  darkChildren: React.ReactNode | ((cb: () => void) => React.ReactNode);
  lightChildren: React.ReactNode | ((cb: () => void) => React.ReactNode);
  loading?: React.ReactNode;
}

export function ThemeSwitcher({
  className,
  darkChildren,
  lightChildren,
  loading,
}: ThemeSwitcherProps) {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const darkcb = () => setTheme("dark");
  const lightcb = () => setTheme("light");

  if (!mounted && loading)
    return <div className={cn(className)}>{loading}</div>;

  if (!mounted && !loading) return null;

  return (
    <>
      {theme === "light" || theme === "system" || !theme ? (
        typeof darkChildren === "function" ? (
          darkChildren(darkcb)
        ) : (
          <button onClick={darkcb} className={cn(className)}>
            {darkChildren}
          </button>
        )
      ) : typeof lightChildren === "function" ? (
        lightChildren(lightcb)
      ) : (
        <button onClick={lightcb} className={cn(className)}>
          {lightChildren}
        </button>
      )}
    </>
  );
}
