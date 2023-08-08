import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { getAllPostsMeta } from "~/lib/mdx";

export function generateMetadata(): Metadata {
  return {
    title: "Browse all articles",
    description: "Browse all articles on NoNovel.io.",
  };
}

export default async function Page() {
  const articles = await getAllPostsMeta();

  return (
    <div className="flex flex-col gap-6">
      {articles.map((article) => (
        <Link
          key={article.slug}
          href={`/articles/${article.slug}`}
          className="nn-interactive block rounded-md p-4"
        >
          <div className="">
            <p className="nn-title mb-2 text-xl font-bold leading-tight">
              {article.title}
            </p>
            <p className="nn-text-secondary mb-4">
              Posted {format(new Date(article.date), "MM/dd/yyyy")}, by{" "}
              <i>{article.author}</i>
            </p>
            <p className="nn-text-secondary">{article.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
