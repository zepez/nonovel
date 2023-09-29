"use client";

import Link from "next/link";
import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Separator } from "~/components/ui/separator";
import { ThemeSwitcher } from "~/components/shared";
import { Logout, LoginDialog } from "~/components/auth";

interface SheetLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}

const SheetLink = ({ href, children, onClick, ...props }: SheetLinkProps) => {
  return (
    <li>
      <Link href={href} className="block py-2" onClick={onClick} {...props}>
        {children}
      </Link>
    </li>
  );
};

interface LayoutMobileHeaderProps {
  username: string | null;
}

export const LayoutMobileHeaderSheet = ({
  username,
}: LayoutMobileHeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex items-center gap-3 px-2 py-1 text-xs font-bold uppercase leading-tight">
        <HamburgerMenuIcon width={25} height={25} /> Menu
      </SheetTrigger>
      <SheetContent
        className="text-left"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="pb-3 font-serif text-3xl">Menu</SheetTitle>
          <SheetDescription className="text-xs font-bold uppercase">
            Escape reality
            <br />
            Read a book
          </SheetDescription>

          <nav>
            <ul className="mt-4">
              <SheetLink href="/" onClick={() => setOpen(false)}>
                Home
              </SheetLink>
              <SheetLink href="/browse" onClick={() => setOpen(false)}>
                Browse
              </SheetLink>
              <Separator className="my-2" />
              <SheetLink href="/articles" onClick={() => setOpen(false)}>
                Articles
              </SheetLink>
              <SheetLink href="/updates" onClick={() => setOpen(false)}>
                Updates
              </SheetLink>
              <ThemeSwitcher
                darkChildren={(cb) => (
                  <li>
                    <button
                      className="block w-full py-2 text-left"
                      onClick={() => {
                        cb();
                        setOpen(false);
                      }}
                      title="Use dark theme"
                    >
                      Dark Theme
                    </button>
                  </li>
                )}
                lightChildren={(cb) => (
                  <li>
                    <button
                      className="block w-full py-2 text-left"
                      onClick={() => {
                        cb();
                        setOpen(false);
                      }}
                      title="Use light theme"
                    >
                      Light Theme
                    </button>
                  </li>
                )}
              />
              <Separator className="my-2" />
              {username ? (
                <>
                  <SheetLink
                    href={`/u/${username}`}
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </SheetLink>
                  <SheetLink
                    href="/settings/profile"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </SheetLink>
                  <li>
                    <Logout className="block w-full py-2 text-left">
                      Logout
                    </Logout>
                  </li>
                </>
              ) : (
                <LoginDialog>
                  <li>
                    <button
                      className="nn-interactive block w-full py-2 text-left"
                      title="Login or register"
                    >
                      Login
                    </button>
                  </li>
                </LoginDialog>
              )}
            </ul>
          </nav>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
