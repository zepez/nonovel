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
      <div className="relative">
        <BackgroundEmoji
          emoji="🎨"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={true}
        />
        <div className="relative z-10 flex h-96 items-center sm:h-64">
          <LayoutWrapper className="py-0">
            <LayoutNavigation genres={genres} />
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="py-0">{children}</LayoutWrapper>
    </>
  );
}
