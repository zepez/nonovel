"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib/utils";

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
    <nav className="bg-nn-secondary flex flex-col gap-4 rounded-md p-2 text-center text-xs font-bold leading-tight sm:flex-row">
      {navigation.map((n) => (
        <Link
          key={n.name}
          href={`/p/${slug}/${n.segment ?? ""}`}
          className={cn(
            n.segment === segment
              ? "nn-no-select cursor-default bg-inherit"
              : "bg-nn-base nn-border nn-interactive border",
            "flex-grow rounded-md py-4 uppercase sm:py-2"
          )}
        >
          {n.name}
        </Link>
      ))}
    </nav>
  );
};
