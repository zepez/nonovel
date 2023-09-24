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
      <BackgroundEmoji emoji="📖" tiled={true}>
        <LayoutWrapper className="py-16">
          <LayoutNavigation genres={genres} />
        </LayoutWrapper>
      </BackgroundEmoji>

      <LayoutWrapper className="py-0">{children}</LayoutWrapper>
    </>
  );
}
