"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { LayoutCommand } from "~/components/shared";
import { Button } from "~/components/ui/button";

export const LayoutSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex w-full max-w-sm ms-center">
        <Button
          variant="outline"
          className="justify-between w-48 text-xs font-normal nn-bg-background nn-text-secondary cursor-text"
          onClick={() => setOpen(true)}
          title="Search (⌘+K)"
        >
          <div className="inline-flex items-center">
            <MagnifyingGlassIcon className="mr-3" />
            Search
          </div>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center rounded bg-zinc-500 px-2 font-mono text-[10px] font-medium text-white opacity-100">
            <span className="mr-[2px] text-xs">⌘</span>k
          </kbd>
        </Button>
      </div>
      <LayoutCommand open={open} setOpen={setOpen} />
    </>
  );
};
