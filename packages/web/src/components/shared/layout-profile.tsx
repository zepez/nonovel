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

import type { GetUserByIdReturn } from "@nonovel/query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui";

interface LayoutProfileProps {
  session: NonNullable<GetUserByIdReturn[1]>;
}

export const LayoutProfile = ({ session }: LayoutProfileProps) => {
  const { setTheme } = useTheme();
  const profilePicture = session.image ?? "/profile.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ms-center flex rounded-md p-1 ">
        <Image
          src={profilePicture}
          alt="Profile picture"
          className="interactive-primary mx-1 rounded-full"
          width={32}
          height={32}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <div className="p-1">
          <DropdownMenuItem>
            <GearIcon className="mx-2" />
            Settings
          </DropdownMenuItem>
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
        <div className="mt-1 flex justify-evenly bg-zinc-100 py-1 dark:bg-zinc-900">
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
