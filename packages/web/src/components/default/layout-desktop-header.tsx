import * as React from "react";
import Link from "next/link";
import { getSession } from "~/lib/auth";
import { cn } from "~/lib/utils";
import { LayoutWrapper, LayoutProfile } from "~/components/shared";
import { FullLogo, ShortLogoDark } from "~/components/brand";
import { LayoutSearch } from "~/components/default/layout-search";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import { LoginDialog } from "~/components/auth";

export async function LayoutDesktopHeader() {
  const [, session] = await getSession();

  return (
    <div className="hidden md:block">
      <LayoutWrapper className="flex flex-col flex-wrap justify-between pb-12 pt-8 md:flex-row">
        <NavigationMenu>
          <NavigationMenuList>
            {/* home */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref title="Home">
                <NavigationMenuLink className="nn-interactive group mr-2 inline-flex h-9 w-max items-center justify-center rounded-md bg-inherit py-2 pr-2 text-sm">
                  <FullLogo className="my-1" />
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
                        className="bg-nn-accent nn-interactive flex h-full w-full select-none flex-col justify-end rounded-md p-6 no-underline"
                        href="/"
                      >
                        <ShortLogoDark className="mb-4 mr-4 text-center text-[5rem]" />
                        <p className="text-sm text-nn-base-dark">
                          Your destination for timeless classics and
                          tomorrow&apos;s bestsellers.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/articles" title="Articles">
                    Broaden your understanding and heighten your reading
                    experience
                  </ListItem>
                  <ListItem href="/updates" title="Updates">
                    Get the scoop on new features and important announcements
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* browse */}
            <NavigationMenuItem>
              <Link href="/browse" legacyBehavior passHref>
                <NavigationMenuLink className="nn-interactive group inline-flex h-9 w-max items-center justify-center rounded-md bg-inherit px-4 py-2 text-sm font-bold">
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
                <LoginDialog>
                  <Button
                    variant="ghost"
                    size="fluid"
                    className="text-sm font-bold text-nn-base-dark dark:text-nn-base-light"
                    title="Login or register"
                  >
                    Login
                  </Button>
                </LoginDialog>
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
          <div className="text-sm font-bold leading-none">
            {icon && <span className="mx-2 text-xl">{icon}</span>} {title}
          </div>
          <p className="nn-detail line-clamp-2 pt-1">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
