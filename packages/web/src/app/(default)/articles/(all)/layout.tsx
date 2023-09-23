import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <div className="relative">
        <BackgroundEmoji
          emoji="🎑"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={true}
        />
        <div className="relative z-10 flex h-96 items-center sm:h-64">
          <LayoutWrapper className="py-0">
            <h1 className="nn-title text-2xl font-bold">Browse Articles</h1>
            <p className="mt-2">
              Dive deeper into the world of your favorite books - broaden your
              understanding and heighten your reading experience.
            </p>
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="pt-0">{children}</LayoutWrapper>
    </>
  );
}
