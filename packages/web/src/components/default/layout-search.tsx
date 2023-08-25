"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { LayoutCommand } from "~/components/shared";
import { Button } from "~/components/ui/button";

export const LayoutSearch = () => {
  const [open, setOpen] = useState(false);
  const [os, setOS] = useState<string>("");

  const availableOS = ["Windows", "Linux", "Mac"]; // add your OS values
  const currentOS = availableOS.find(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
    (v) => (global as any).window?.navigator.platform.indexOf(v) >= 0
  );

  useEffect(() => {
    if (currentOS && currentOS !== os) setOS(currentOS);
  }, [currentOS, os]);

  return (
    <>
      <div className="ms-center flex w-full max-w-sm">
        <Button
          variant="outline"
          className="nn-bg-background nn-text-secondary w-48 cursor-text justify-between text-xs font-normal"
          onClick={() => setOpen(true)}
          title="Search (⌘+K)"
        >
          <div className="inline-flex items-center">
            <MagnifyingGlassIcon className="mr-3" />
            Search
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded bg-zinc-500 px-2 font-mono text-[10px] font-medium text-white opacity-100">
            <span className="mr-[2px] text-xs">
              {os === "Mac" && "⌘"}
              {(os === "Windows" || os === "Linux") && "Ctrl"}
            </span>
            k
          </kbd>
        </Button>
      </div>
      <LayoutCommand open={open} setOpen={setOpen} />
    </>
  );
};
