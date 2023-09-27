import { format } from "date-fns";
import Balancer from "react-wrap-balancer";
import { getPostBySlug } from "~/lib/mdx";
import {
  LayoutWrapper,
  BackgroundEmoji,
  CommentLayout,
} from "~/components/shared";

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
      <BackgroundEmoji emoji="🧶" tiled={false}>
        <LayoutWrapper className="max-w-5xl pb-16 pt-4">
          <h1 className="nn-title">
            <Balancer>{article.meta.title}</Balancer>
          </h1>
          <span className="mt-4 block">
            Posted {format(new Date(article.meta.date), "MM/dd/yyyy")}, by{" "}
            <i>{article.meta.author}</i>
          </span>
        </LayoutWrapper>
      </BackgroundEmoji>

      <LayoutWrapper className="max-w-3xl">{children}</LayoutWrapper>

      <CommentLayout resourceId={article.meta.id} resourceType="article" />
    </>
  );
}
