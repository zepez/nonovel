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
    <nav className="nn-divide flex flex-col divide-y rounded-md text-center text-xs font-bold leading-tight sm:flex-row sm:divide-x sm:divide-y-0">
      {navigation.map((n) => (
        <Link
          key={n.name}
          href={`/p/${slug}/${n.segment ?? ""}`}
          className={cn(
            n.segment === segment
              ? "nn-no-select cursor-default opacity-50"
              : "nn-interactive shadow-sm",
            "bg-nn-secondary flex-grow py-3 uppercase first:rounded-t-md last:rounded-b-md sm:first:rounded-l-md sm:first:rounded-tr-none sm:last:rounded-r-md sm:last:rounded-bl-none"
          )}
        >
          {n.name}
        </Link>
      ))}
    </nav>
  );
};
