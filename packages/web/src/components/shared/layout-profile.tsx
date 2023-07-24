"use client";

import Image from "next/image";
import Link from "next/link";
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
import { ThemeSwitcher } from "./theme-switcher";
import { Logout } from "~/components/auth";

interface LayoutProfileProps {
  session: Session;
}

export const LayoutProfile = ({ session }: LayoutProfileProps) => {
  const { profile } = session;

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
      <DropdownMenuTrigger className="nn-interactive ms-center flex rounded-md">
        <Image
          src={profilePicture}
          alt="Profile picture"
          className="nn-border mx-1 rounded-full border"
          width={36}
          height={36}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-1">
          {profileNavItems.map(({ title, href, icon }, itemIdx) => (
            <DropdownMenuItem key={itemIdx} className="p-0">
              <Link
                href={href}
                className="flex w-full items-center px-2 py-1.5"
              >
                {icon}
                {title}
              </Link>
            </DropdownMenuItem>
          ))}
          <ThemeSwitcher
            darkChildren={(cb) => (
              <DropdownMenuItem className="p-0" onClick={cb}>
                <button className="flex w-full items-center px-2 py-1.5">
                  <MoonIcon className="mx-2" /> Dark Theme
                </button>
              </DropdownMenuItem>
            )}
            lightChildren={(cb) => (
              <DropdownMenuItem
                className="flex w-full items-center"
                onClick={cb}
              >
                <SunIcon className="mx-2" /> Light Theme
              </DropdownMenuItem>
            )}
          />
          <Logout className="block w-full">
            {(cb) => (
              <DropdownMenuItem onClick={cb} className="p-0">
                <button className="flex w-full items-center px-2 py-1.5">
                  <ThickArrowRightIcon className="mx-2" />
                  Logout
                </button>
              </DropdownMenuItem>
            )}
          </Logout>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
