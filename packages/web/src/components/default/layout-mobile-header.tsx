import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
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
import { LayoutWrapper, BrandIcon } from "~/components/shared";

export const LayoutMobileHeader = () => {
  return (
    <div className="nn-bg-foreground nn-border-bottom md:hidden">
      <LayoutWrapper className="flex items-center justify-between px-4 py-2">
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
          </NavigationMenuList>
        </NavigationMenu>
        {/* hamberger menu */}
        <Sheet>
          <SheetTrigger className="flex items-center gap-2 px-2 py-1">
            <HamburgerMenuIcon width={25} height={25} /> Menu
          </SheetTrigger>
          <SheetContent className="text-left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>

              <nav>
                <ul className="mt-4">
                  <li>
                    <Link href="/" className="block py-2">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/browse" className="block py-2">
                      Browse
                    </Link>
                  </li>
                  <Separator className="my-2" />
                  <li>
                    <Link href="/articles" className="block py-2">
                      Articles
                    </Link>
                  </li>
                  <li>
                    <Link href="/updates" className="block py-2">
                      Updates
                    </Link>
                  </li>
                  <Separator className="my-2" />
                  <li>
                    <Link href="/api/auth/signin" className="block py-2">
                      Login
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </LayoutWrapper>
    </div>
  );
};
