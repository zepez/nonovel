"use client";

import * as React from "react";
import Link from "next/link";
import type { Session } from "~/lib/auth";
import { cn } from "~/lib/utils";
import { LayoutWrapper, BrandIcon, LayoutProfile } from "~/components/shared";
import { Input } from "~/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const components: {
  title: string;
  href: string;
  description: string;
  icon: string;
}[] = [
  {
    title: "Fantasy",
    icon: "🧙🏼‍♂️",
    href: "/browse/fantasy",
    description:
      "Dive into our treasure trove of fantasy - no magic carpet required",
  },
  {
    title: "Sci-Fi",
    icon: "👽",
    href: "/browse/sci-fi",
    description: "Beam up to a universe of future-tech and alien worlds",
  },
  {
    title: "Action",
    icon: "🥊",
    href: "/browse/action",
    description:
      "Dive into a whirlwind of thrilling chases, battles, and daring deeds",
  },
];

interface LayoutDesktopHeaderProps {
  session: Session | null;
}

export function LayoutDesktopHeader({ session }: LayoutDesktopHeaderProps) {
  return (
    <div className="background">
      <LayoutWrapper className="flex flex-col flex-wrap justify-between px-4 py-2 md:flex-row">
        <NavigationMenu>
          <NavigationMenuList>
            {/* sign up / account */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "font-brand text-3xl"
                  )}
                >
                  <BrandIcon />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {/* about */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="interactive-primary flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline"
                        href="/"
                      >
                        <BrandIcon className="mb-4 mr-4 text-center text-[5rem]" />
                        <div className="mb-2 text-lg font-medium">NoNovel</div>
                        <p className="text-secondary">
                          Immersive digital narratives beamed directly into your
                          eye sockets
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/publish" title="Publish">
                    Manage and share your creative brilliance with the world
                  </ListItem>
                  <ListItem href="/ranking" title="Ranking">
                    Novels curated and ranked based on popularity
                  </ListItem>
                  <ListItem href="/updates" title="Updates">
                    Stay up to date with new features and site announcements
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* browse */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>Browse</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      icon={component.icon}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                  <ListItem
                    title="View More"
                    icon="📚"
                    href="/browse"
                    className="interactive-primary"
                  >
                    Ready for more? Uncover endless stories across countless
                    genres
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList>
            {/* search */}
            <NavigationMenuItem>
              <div className="ms-center flex w-full max-w-sm">
                <Input type="text" placeholder="search" />
              </div>
            </NavigationMenuItem>

            {/* sign up / profile */}
            {session ? (
              <LayoutProfile session={session} />
            ) : (
              <NavigationMenuItem className="py-1 pl-2">
                <Link href="/api/auth/signin" legacyBehavior passHref>
                  <NavigationMenuLink className="rounded-md border border-zinc-950 bg-zinc-950 p-2 text-sm text-white dark:bg-white dark:text-black">
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </LayoutWrapper>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: string }
>(({ className, title, icon, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "interactive block select-none space-y-1 rounded-md p-3 leading-none no-underline",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            {icon && <span className="text-xl">{icon}</span>} {title}
          </div>
          <p className="text-secondary line-clamp-2">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
