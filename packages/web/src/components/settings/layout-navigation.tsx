"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "~/lib/utils";

const navigation = [
  { name: "Account", href: "/settings/account", segment: "account" },
  { name: "Profile", href: "/settings/profile", segment: "profile" },
];

export const LayoutNavigation = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <div>
      <nav className="bg-nn-base nn-divide flex flex-col divide-y rounded-md text-center first:rounded-t-md last:rounded-b-md">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className={cn(
              item.segment !== segment &&
                "bg-nn-secondary nn-interactive first:rounded-t-md last:rounded-b-md",
              "py-3 text-sm"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
