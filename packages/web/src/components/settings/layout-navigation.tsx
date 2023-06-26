import Link from "next/link";

import { cn } from "~/lib/utils";

const navigation = [
  { name: "Account", href: "settings/account" },
  { name: "Profile", href: "settings/profile" },
  { name: "Notifications", href: "settings/notifications" },
  { name: "Privacy", href: "settings/privacy" },
  { name: "Billing", href: "settings/billing" },
];

interface LayoutNavigationProps {
  segment: string;
}

export const LayoutNavigation = ({ segment }: LayoutNavigationProps) => {
  return (
    <nav className="flex flex-col space-y-2 text-center">
      {navigation.map((item) => (
        <Link
          href={`/${item.href}`}
          key={item.name}
          className={cn(
            item.href === segment
              ? "bg-zinc-100 dark:bg-zinc-900"
              : "interactive",
            "rounded-md py-3 text-sm"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
};
