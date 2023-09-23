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
import { LoginDialog } from "~/components/auth";

export async function LayoutDesktopHeader() {
  const [, session] = await getSession();

  return (
    <div className="hidden border-b nn-bg-foreground nn-border md:block">
      <LayoutWrapper className="flex flex-col flex-wrap justify-between px-4 py-2 md:flex-row">
        <NavigationMenu>
          <NavigationMenuList>
            {/* home */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref title="Home">
                <NavigationMenuLink className="inline-flex items-center justify-center px-2 py-2 mx-2 text-sm font-medium rounded-md nn-interactive group h-9 w-max bg-inherit">
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
                        className="flex flex-col justify-end w-full h-full p-6 no-underline rounded-md select-none nn-bg-primary nn-interactive"
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
                <NavigationMenuLink className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md nn-interactive group h-9 w-max bg-inherit">
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
                  <button
                    className="p-2 text-xs font-bold uppercase border rounded-md nn-bg-contrast nn-interactive"
                    title="Login or register"
                  >
                    Login
                  </button>
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
          <div className="text-sm font-medium leading-none">
            {icon && <span className="mx-2 text-xl">{icon}</span>} {title}
          </div>
          <p className="pt-1 nn-text-secondary line-clamp-2">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
