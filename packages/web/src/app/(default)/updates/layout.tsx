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
          className="absolute inset-0 z-0 w-full h-full nn-bg-blurred"
          tiled={false}
        />
        <div className="relative z-10 flex items-center h-96 sm:h-64">
          <LayoutWrapper className="py-0">
            <h1 className="text-2xl font-bold nn-title">
              Updates
            </h1>
            <p className="mt-2">
              Get the scoop on all the fresh features and important
              announcements shaking things up at NoNovel.io.
            </p>
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="mb-16 border-b border-l border-r nn-bg-foreground nn-border-50 md:rounded-b-md">
        {children}
      </LayoutWrapper>
    </>
  );
}
