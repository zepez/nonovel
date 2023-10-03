"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib";

const navigation = [
  {
    name: "Chapters",
    segment: null,
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
    <nav className="flex flex-col gap-y-4 rounded-md text-center text-xs font-bold leading-tight sm:flex-row sm:gap-y-0">
      {navigation.map((n) => (
        <Link
          key={n.name}
          href={`/read/${slug}/${n.segment ?? ""}`}
          className={cn(
            n.segment === segment
              ? "nn-no-select cursor-default opacity-50"
              : "nn-interactive shadow-sm",
            "bg-nn-secondary nn-border flex-grow rounded-md py-3 uppercase sm:first:rounded-l-md sm:first:rounded-r-none sm:first:border-r sm:last:rounded-l-none sm:last:border-l"
          )}
        >
          {n.name}
        </Link>
      ))}
    </nav>
  );
};
