import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <BackgroundEmoji emoji="🎑" tiled={true}>
        <LayoutWrapper className="flex flex-col justify-center py-16">
          <h1 className="nn-title text-2xl font-bold">Browse Articles</h1>
          <p className="mt-2">
            Dive deeper into the world of your favorite books - broaden your
            understanding and heighten your reading experience.
          </p>
        </LayoutWrapper>
      </BackgroundEmoji>

      <LayoutWrapper className="pt-0">{children}</LayoutWrapper>
    </>
  );
}
