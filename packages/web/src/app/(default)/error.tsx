"use client";

import { useEffect } from "react";
import Link from "next/link";

import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";
import { Button } from "~/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <BackgroundEmoji emoji="🔥" tiled={true}>
      <LayoutWrapper className="pb-16 pt-4">
        <h1 className="nn-title pb-1">Error: Unable to Get Resource</h1>
        <p className="pt-3 text-lg">{error.message}</p>
        <p className="text-lg">Please wait a few minutes and try again.</p>
        <nav className="mt-8 flex items-center justify-start gap-4">
          <Button
            onClick={() => reset()}
            variant="contrast"
            size="fluid"
            className="text-xs font-bold uppercase leading-tight"
          >
            Retry
          </Button>
          <Link
            href="/"
            className="nn-interactive text-xs font-bold uppercase leading-tight"
          >
            Go home
          </Link>
        </nav>
      </LayoutWrapper>
    </BackgroundEmoji>
  );
}
