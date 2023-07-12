"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  MoonIcon,
  SunIcon,
  GearIcon,
  PersonIcon,
  ThickArrowRightIcon,
} from "@radix-ui/react-icons";

import type { Session } from "~/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface LayoutProfileProps {
  session: Session;
}

export const LayoutProfile = ({ session }: LayoutProfileProps) => {
  const { profile } = session;

  const { setTheme, theme } = useTheme();
  const profilePicture = profile.image ?? "/profile.png";

  const profileNavItems = [
    {
      title: "Profile",
      href: `/u/${profile.username}`,
      icon: <PersonIcon className="mx-2" />,
    },
    {
      title: "Settings",
      href: "/settings/account",
      icon: <GearIcon className="mx-2" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="nn-interactive ms-center flex rounded-md p-1 ">
        <Image
          src={profilePicture}
          alt="Profile picture"
          className="mx-1 rounded-full"
          width={32}
          height={32}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-1">
          {profileNavItems.map(({ title, href, icon }, itemIdx) => (
            <Link key={itemIdx} href={href}>
              <DropdownMenuItem>
                {icon}
                {title}
              </DropdownMenuItem>
            </Link>
          ))}
          {theme === "light" || theme === "system" || !theme ? (
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <MoonIcon className="mx-2" />
              Dark Theme
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <SunIcon className="mx-2" />
              Light Theme
            </DropdownMenuItem>
          )}
          <Link href="/api/auth/signout">
            <DropdownMenuItem>
              <ThickArrowRightIcon className="mx-2" />
              Logout
            </DropdownMenuItem>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
