import Link from "next/link";
import { getSession } from "~/lib/auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { LayoutMobileHeaderSheet } from "./layout-mobile-header-sheet";
import { LayoutWrapper, BrandIcon } from "~/components/shared";

export const LayoutMobileHeader = async () => {
  const [, session] = await getSession();
  const { profile } = session ?? {};
  const { username } = profile ?? { username: null };

  return (
    <div className="border-b nn-bg-foreground nn-border md:hidden">
      <LayoutWrapper className="flex items-center justify-between px-4 py-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref title="Home">
                <NavigationMenuLink className="inline-flex items-center justify-center px-2 py-2 mx-2 text-sm font-medium rounded-md nn-interactive group h-9 w-max bg-inherit">
                  <BrandIcon className="my-1" />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <LayoutMobileHeaderSheet username={username} />
      </LayoutWrapper>
    </div>
  );
};
