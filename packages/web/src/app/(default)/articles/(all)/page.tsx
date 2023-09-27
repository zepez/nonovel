import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { getAllPostsMeta } from "~/lib/mdx";

export function generateMetadata(): Metadata {
  return {
    title: "Articles",
    description: "Browse all articles on NoNovel.io.",
  };
}

export default async function Page() {
  const articles = await getAllPostsMeta();

  return (
    <div className="nn-divide mt-4 flex flex-col gap-4 divide-y first:-mt-4">
      {articles.map((article) => (
        <div key={article.slug} className="pt-4">
          <Link
            href={`/articles/${article.slug}`}
            className="nn-interactive -mx-4 block rounded-md py-4"
          >
            <div className="px-4">
              <p className="mb-2 text-xl font-bold">{article.title}</p>
              <p className="nn-detail mb-4">
                Posted {format(new Date(article.date), "MM/dd/yyyy")}, by{" "}
                <i>{article.author}</i>
              </p>
              <p className="nn-detail">{article.description}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
