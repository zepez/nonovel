import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface UpdatesLayoutProps {
  children: React.ReactNode;
}

export default function UpdatesLayout({ children }: UpdatesLayoutProps) {
  return (
    <>
      <div className="relative overflow-hidden">
        <BackgroundEmoji
          emoji="🦺"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={false}
        />
        <div className="relative z-10 flex h-96 items-center sm:h-64">
          <LayoutWrapper className="lg:px-16">
            <h1 className="text-2xl font-bold leading-tight">Updates</h1>
            <p className="mt-2">
              Get the scoop on all the fresh features and important
              announcements shaking things up at NoNovel.io.
            </p>
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12 lg:px-16">
        {children}
      </LayoutWrapper>
    </>
  );
}
