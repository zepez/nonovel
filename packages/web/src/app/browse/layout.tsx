import { notFound } from "next/navigation";

import { getGenreManifest } from "~/lib/request";
import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";
import { LayoutNavigation } from "~/components/browse";

interface BrowseLayoutProps {
  children: React.ReactNode;
}

export default async function BrowseLayout({ children }: BrowseLayoutProps) {
  const [, genres] = await getGenreManifest();
  if (!genres) return notFound();

  return (
    <>
      <div className="relative overflow-hidden">
        <BackgroundEmoji
          emoji="🥶"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={false}
        />
        <div className="relative z-10 flex h-64 items-center">
          <LayoutWrapper className="lg:px-16">
            <LayoutNavigation genres={genres} />
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12 lg:px-16">
        {children}
      </LayoutWrapper>
    </>
  );
}
