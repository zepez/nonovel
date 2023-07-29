"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib/utils";

const navigation = [
  {
    name: "Overview",
    segment: null,
  },
  {
    name: "Chapters",
    segment: "chapters",
  },
  {
    name: "Reviews",
    segment: "reviews",
  },
];

interface LayoutNavigationProps {
  slug: string;
}

export const LayoutNavigation = ({ slug }: LayoutNavigationProps) => {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="flex flex-col gap-1 p-2 text-xs font-bold leading-tight text-center rounded-md nn-bg-background nn-border-50 sm:flex-row">
      {navigation.map((n) => (
        <Link
          key={n.name}
          href={`/p/${slug}/${n.segment ?? ""}`}
          className={cn(
            n.segment === segment
              ? "nn-no-select cursor-default bg-inherit"
              : "nn-bg-foreground nn-border-50 nn-interactive",
            "flex-grow rounded-md py-4 uppercase sm:py-2"
          )}
        >
          {n.name}
        </Link>
      ))}
    </nav>
  );
};
