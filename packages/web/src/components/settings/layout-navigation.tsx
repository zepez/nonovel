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
      <nav className="nn-border grid grid-cols-1 text-center md:border-r md:pr-8">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className={cn(
              item.segment === segment
                ? "bg-nn-secondary nn-border border"
                : "nn-interactive",
              "my-1 rounded-md py-3 text-sm"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
