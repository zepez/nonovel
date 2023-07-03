"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  MoonIcon,
  SunIcon,
  GearIcon,
  Pencil1Icon,
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
      <DropdownMenuContent className="w-48">
        <div className="p-1">
          <Link href="/settings/account">
            <DropdownMenuItem>
              <GearIcon className="mx-2" />
              Settings
            </DropdownMenuItem>
          </Link>
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
          <DropdownMenuItem>
            <Pencil1Icon className="mx-2" />
            Write
          </DropdownMenuItem>
          <Link href="/api/auth/signout">
            <DropdownMenuItem>
              <ThickArrowRightIcon className="mx-2" />
              Logout
            </DropdownMenuItem>
          </Link>
        </div>
        {/* <div className="flex py-1 mt-1 nn-bg-foreground justify-evenly">
          {theme === "light" ? (
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="p-2 rounded-md"
            >
              <MoonIcon className="h-[1.3rem] w-[1.3rem]" /> Dark Mode
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="p-2 rounded-md"
            >
              <SunIcon className="h-[1.3rem] w-[1.3rem]" /> Light Mode
            </DropdownMenuItem>
          )}
        </div> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
