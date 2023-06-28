"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "~/lib/utils";

const navigation = [
  { name: "Account", href: "/settings/account", segment: "account" },
  { name: "Profile", href: "/settings/profile", segment: "profile" },
  {
    name: "Notifications",
    href: "/settings/notifications",
    segment: "notifications",
  },
  { name: "Privacy", href: "/settings/privacy", segment: "privacy" },
  { name: "Billing", href: "/settings/billing", segment: "billing" },
];

export const LayoutNavigation = () => {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="flex flex-col space-y-2 text-center">
      {navigation.map((item) => (
        <Link
          href={item.href}
          key={item.name}
          className={cn(
            item.segment === segment ? "nn-bg-foreground" : "nn-interactive",
            "rounded-md py-3 text-sm"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
