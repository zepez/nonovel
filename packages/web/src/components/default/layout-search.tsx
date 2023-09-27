"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { LayoutCommand } from "~/components/shared";
import { Button } from "~/components/ui/button";

export const LayoutSearch = () => {
  const [open, setOpen] = useState(false);
  const [shortcut, setShortcut] = useState("+k");

  const availableOS = ["Windows", "Linux", "Mac"];

  useEffect(() => {
    try {
      const os = availableOS.find(
        (v) => (global as any).window?.navigator.platform.indexOf(v) >= 0
      );

      if (os === "Mac") setShortcut("⌘+k");
      else setShortcut("ctrl+k");
    } catch (e) {
      setShortcut("ctrl+k");
    }
  }, []);

  return (
    <>
      <div className="ms-center flex w-full max-w-sm">
        <Button
          variant="ghost"
          size="fluid"
          className="w-48 cursor-text justify-between border border-nn-base-dark text-xs font-normal dark:border-nn-base-light"
          onClick={() => setOpen(true)}
          title="Search (⌘+K)"
        >
          <div className="inline-flex items-center">
            <MagnifyingGlassIcon className="mr-3" />
            Search
          </div>
          <kbd className="bg-nn-base-invert pointer-events-none inline-flex h-4 select-none items-center rounded px-2 font-mono text-xs">
            {shortcut}
          </kbd>
        </Button>
      </div>
      <LayoutCommand open={open} setOpen={setOpen} />
    </>
  );
};
