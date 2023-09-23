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
          className="absolute inset-0 z-0 w-full h-full nn-bg-blurred"
          tiled={false}
        />
        <div className="relative z-10 flex items-center h-96 sm:h-64">
          <LayoutWrapper className="py-0">
            <h1 className="text-3xl font-bold nn-title sm:text-4xl">
              {article.meta.title}
            </h1>
            <span className="block mt-4">
              Posted {format(new Date(article.meta.date), "MM/dd/yyyy")}, by{" "}
              <i>{article.meta.author}</i>
            </span>
          </LayoutWrapper>
        </div>
      </div>

      <LayoutWrapper className="mb-16 border-b border-l border-r nn-bg-foreground nn-border-50 md:rounded-b-md">
        {children}
      </LayoutWrapper>

      <CommentLayout resourceId={article.meta.id} resourceType="article" />
    </>
  );
}
