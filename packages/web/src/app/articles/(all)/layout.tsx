import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <div className="relative overflow-hidden">
        <BackgroundEmoji
          emoji="🎑"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={false}
        />
        <div className="relative z-10 flex h-96 items-center sm:h-64">
          <LayoutWrapper className="lg:px-16">
            <h1 className="nn-title text-2xl font-bold leading-tight">
              Browse Articles
            </h1>
            <p className="mt-2">
              Dive deeper into the world of your favorite books - broaden your
              understanding and heighten your reading experience.
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
