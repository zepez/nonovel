import Link from "next/link";
import { getSession } from "~/lib/auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { LayoutMobileHeaderSheet } from "./layout-mobile-header-sheet";
import { LayoutWrapper } from "~/components/shared";
import { ShortLogo } from "~/components/brand";

export const LayoutMobileHeader = async () => {
  const [, session] = await getSession();
  const { profile } = session ?? {};
  const { username } = profile ?? { username: null };

  return (
    <div className="pt-6 md:hidden">
      <LayoutWrapper className="flex items-center justify-between px-4 py-0">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref title="Home">
                <NavigationMenuLink className="nn-interactive group mx-2 inline-flex h-9 w-max items-center justify-center rounded-md bg-inherit px-2 py-2 text-sm font-medium">
                  <ShortLogo className="my-1 h-[35px] w-[35px]" />
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
