import * as React from "react";
import Link from "next/link";
import { getSession } from "~/lib/auth";
import { cn } from "~/lib/utils";
import { LayoutWrapper, BrandIcon, LayoutProfile } from "~/components/shared";
import { LayoutSearch } from "~/components/default/layout-search";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";

export async function LayoutDesktopHeader() {
  const [, session] = await getSession();

  return (
    <div className="nn-bg-foreground nn-border-bottom hidden md:block">
      <LayoutWrapper className="flex flex-col flex-wrap justify-between px-4 py-2 md:flex-row">
        <NavigationMenu>
          <NavigationMenuList>
            {/* home */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="nn-interactive group mx-2 inline-flex h-9 w-max items-center justify-center rounded-md bg-inherit px-2 py-2 text-sm font-medium">
                  <BrandIcon className="my-1" />
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
                        className="nn-bg-primary nn-interactive flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline"
                        href="/"
                      >
                        <BrandIcon className="mb-4 mr-4 text-center text-[5rem]" />
                        <div className="mb-2 text-lg font-medium">NoNovel</div>
                        <p className="nn-text-secondary">
                          Your destination for timeless classics and
                          tomorrow&apos;s bestsellers.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/articles" title="Articles">
                    Manage and share your creative brilliance with the world
                  </ListItem>
                  <ListItem href="/updates" title="Updates">
                    Stay up to date with new features and site announcements
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* browse */}
            <NavigationMenuItem>
              <Link href="/browse" legacyBehavior passHref>
                <NavigationMenuLink className="nn-interactive group inline-flex h-9 w-max items-center justify-center rounded-md bg-inherit px-4 py-2 text-sm font-medium">
                  Browse
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-3">
            {/* search */}
            <NavigationMenuItem>
              <LayoutSearch />
            </NavigationMenuItem>

            {/* sign up / profile */}
            {session ? (
              <LayoutProfile session={session} />
            ) : (
              <NavigationMenuItem>
                <Link href="/api/auth/signin" legacyBehavior passHref>
                  <NavigationMenuLink className="nn-bg-contrast nn-interactive rounded-md border p-2 text-xs font-bold uppercase">
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
            "nn-interactive block select-none space-y-1 rounded-md p-3 leading-none no-underline",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">
            {icon && <span className="mx-2 text-xl">{icon}</span>} {title}
          </div>
          <p className="nn-text-secondary line-clamp-2 pt-1">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
