import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface UpdatesLayoutProps {
  children: React.ReactNode;
}

export default function UpdatesLayout({ children }: UpdatesLayoutProps) {
  return (
    <>
      <div className="relative">
        <BackgroundEmoji
          emoji="🦺"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={true}
        />
        <div className="relative z-10 flex h-96 items-center sm:h-64">
          <LayoutWrapper className="py-0">
            <h1 className="nn-title text-2xl font-bold">Updates</h1>
            <p className="mt-2">
              Get the scoop on all the fresh features and important
              announcements shaking things up at NoNovel.io.
            </p>
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="pt-0">{children}</LayoutWrapper>
    </>
  );
}
