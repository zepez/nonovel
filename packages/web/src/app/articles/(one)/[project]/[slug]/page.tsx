import { Metadata } from "next";
import Link from "next/link";
import { getPostBySlug } from "~/lib/mdx";
import { getProjectBySlug } from "~/lib/request";
import { src } from "~/lib/string";
import { AspectImage } from "~/components/shared";

interface Props {
  params: { project: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, project } = params;

  const article = await getPostBySlug(`${project}/${slug}`);

  return {
    title: article.meta.title,
    description: article.meta.description,
  };
}

export default async function Page({ params }: Props) {
  const { slug, project } = params;
  const article = await getPostBySlug(`${project}/${slug}`);

  const [, proj] = await getProjectBySlug({ slug: project });

  return (
    <>
      <div className="prose prose-lg max-w-none dark:prose-invert prose-h2:font-title prose-h2:text-2xl prose-img:mx-auto">
        {article.content}
      </div>
      {proj && (
        <Link
          href={`/p/${proj.slug}`}
          className="nn-interactive nn-border-50 nn-bg-background mt-12 flex flex-wrap gap-6 rounded-md border p-8 sm:flex-nowrap"
        >
          <AspectImage
            src={src(proj.cover, "cover")}
            alt={proj.name}
            width={150}
            className="mx-auto flex w-auto flex-shrink-0 items-start justify-center"
          />
          <div className="flex min-w-0 flex-shrink flex-col">
            <p className="nn-title mb-2 text-2xl">
              Read &quot;{proj.name}&quot; on nonovel.io
            </p>
            <p className="nn-text-secondary flex-grow">{proj.description}</p>
            <div className="mt-4 flex flex-shrink-0 items-center gap-2 overflow-x-scroll whitespace-nowrap scrollbar-none">
              {proj.genres.map(({ genre }) => (
                <div
                  key={genre.id}
                  className="nn-border nn-bg-foreground nn-text-secondary rounded-sm border px-2 py-1"
                >
                  {genre.name}
                </div>
              ))}
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
