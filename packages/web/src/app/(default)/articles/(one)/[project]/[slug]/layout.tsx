import { format } from "date-fns";
import {
  LayoutWrapper,
  BackgroundEmoji,
  CommentLayout,
} from "~/components/shared";
import { getPostBySlug } from "~/lib/mdx";

interface ArticleLayoutProps {
  children: React.ReactNode;
  params: { project: string; slug: string };
}

export default async function ArticleLayout({
  children,
  params,
}: ArticleLayoutProps) {
  const { slug, project } = params;
  const article = await getPostBySlug(`${project}/${slug}`);

  return (
    <>
      <div className="relative overflow-hidden">
        <BackgroundEmoji
          emoji="🎑"
          className="nn-bg-blurred absolute inset-0 z-0 h-full w-full"
          tiled={false}
        />
        <div className="relative z-10 flex h-96 items-center sm:h-64">
          <LayoutWrapper className="max-w-5xl py-0">
            <h1 className="nn-title text-3xl font-bold sm:text-4xl">
              {article.meta.title}
            </h1>
            <span className="mt-4 block">
              Posted {format(new Date(article.meta.date), "MM/dd/yyyy")}, by{" "}
              <i>{article.meta.author}</i>
            </span>
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="max-w-3xl">{children}</LayoutWrapper>

      <CommentLayout resourceId={article.meta.id} resourceType="article" />
    </>
  );
}
