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
      <nav className="grid grid-cols-1 divide-y divide-zinc-500/50 text-center">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className={cn(
              item.segment === segment ? "nn-bg-foreground" : "nn-interactive",
              "py-4 text-sm"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
