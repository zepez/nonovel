"use client";

import Link from "next/link";
import {
  MoonIcon,
  SunIcon,
  GearIcon,
  PersonIcon,
  ThickArrowRightIcon,
} from "@radix-ui/react-icons";
import type { Session } from "~/lib/server";
import { src } from "~/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Logout } from "~/components/auth";
import { ThemeSwitcher } from "./theme-switcher";
import { LayoutProfileImage } from "./layout-profile-image";

interface LayoutProfileProps {
  session: Session;
}

export const LayoutProfile = ({ session }: LayoutProfileProps) => {
  const { profile } = session;

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
      <DropdownMenuTrigger className="nn-interactive ms-center bg-nn-base-invert flex overflow-hidden rounded-md">
        <LayoutProfileImage seed={profile.username} size={32} />
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
                <button
                  className="flex w-full items-center px-2 py-1.5"
                  title="Use dark theme"
                >
                  <MoonIcon className="mx-2" /> Dark Theme
                </button>
              </DropdownMenuItem>
            )}
            lightChildren={(cb) => (
              <DropdownMenuItem className="p-0" onClick={cb}>
                <button
                  className="flex w-full items-center px-2 py-1.5"
                  title="Use light theme"
                >
                  <SunIcon className="mx-2" /> Light Theme
                </button>
              </DropdownMenuItem>
            )}
          />
          <Logout className="block w-full">
            {(cb) => (
              <DropdownMenuItem onClick={cb} className="p-0">
                <button
                  className="flex w-full items-center px-2 py-1.5"
                  title="Logout"
                >
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
