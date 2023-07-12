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
    <nav className="nn-bg-background nn-border-50 flex flex-col gap-1 rounded-md p-2 text-center text-xs font-bold leading-tight sm:flex-row">
      {navigation.map((n) => (
        <Link
          key={n.name}
          href={`/p/${slug}/${n.segment ?? ""}`}
          className={cn(
            n.segment === segment
              ? "nn-no-select cursor-default bg-inherit"
              : "nn-bg-foreground nn-border-50 nn-interactive",
            "flex-grow rounded-md py-2 uppercase"
          )}
        >
          {n.name}
        </Link>
      ))}
    </nav>
  );
};
