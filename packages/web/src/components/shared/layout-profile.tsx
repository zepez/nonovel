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

  const { setTheme } = useTheme();
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
        <div className="nn-bg-foreground mt-1 flex justify-evenly py-1">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className="rounded-md p-2"
          >
            <SunIcon className="h-[1.3rem] w-[1.3rem]" />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className="rounded-md p-2"
          >
            <MoonIcon className="h-[1.3rem] w-[1.3rem]" />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
