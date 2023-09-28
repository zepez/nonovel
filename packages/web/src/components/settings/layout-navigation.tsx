"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "~/lib";

const navigation = [
  { name: "Account", href: "/settings/account", segment: "account" },
  { name: "Profile", href: "/settings/profile", segment: "profile" },
];

export const LayoutNavigation = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <div>
      <nav className="flex flex-col text-center">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.name}
            className={cn(
              item.segment === segment
                ? "nn-no-select cursor-default opacity-50"
                : "nn-interactive shadow-sm",
              "bg-nn-secondary nn-border py-3 text-sm first:rounded-t-md first:border-b last:rounded-b-md last:border-t"
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
