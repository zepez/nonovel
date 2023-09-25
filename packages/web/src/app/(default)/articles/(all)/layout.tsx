import { LayoutWrapper, BackgroundEmoji } from "~/components/shared";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return (
    <>
      <BackgroundEmoji emoji="🐟" tiled={false}>
        <LayoutWrapper className="flex flex-col justify-center pb-16 pt-4">
          <h1 className="nn-title">Browse Articles</h1>
          <p className="mt-2">
            Dive deeper into the world of your favorite books - broaden your
            understanding and heighten your reading experience.
          </p>
        </LayoutWrapper>
      </BackgroundEmoji>

      <LayoutWrapper>{children}</LayoutWrapper>
    </>
  );
}
