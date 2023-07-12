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

export async function LayoutDesktopHeader() {
  const [, session] = await getSession();

  return (
    <div className="nn-bg-foreground nn-border-bottom">
      <LayoutWrapper className="flex flex-col flex-wrap justify-between px-4 py-2 md:flex-row">
        <NavigationMenu>
          <NavigationMenuList>
            {/* sign up / account */}
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="nn-interactive group inline-flex h-9 w-max items-center justify-center rounded-md bg-inherit px-4 py-2 text-sm font-medium">
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
                    className="nn-bg-primary nn-interactive"
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
              <LayoutSearch />
            </NavigationMenuItem>

            {/* sign up / profile */}
            {session ? (
              <LayoutProfile session={session} />
            ) : (
              <NavigationMenuItem className="py-1 pl-2">
                <Link href="/api/auth/signin" legacyBehavior passHref>
                  <NavigationMenuLink className="nn-bg-contrast rounded-md border p-2 text-sm">
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
