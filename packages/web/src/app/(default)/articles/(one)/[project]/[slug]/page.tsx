import { Metadata } from "next";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
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
      <div className="prose-lg dark:prose-invert prose max-w-none prose-headings:pb-4 prose-headings:pt-8 prose-headings:font-bold prose-headings:leading-tight prose-h2:text-[1.8rem] prose-h3:text-xl prose-img:mx-auto prose-img:pb-4 prose-img:pt-2">
        {article.content}
      </div>
      {proj && (
        <Link
          href={`/p/${proj.slug}`}
          className="nn-interactive bg-nn-secondary mt-12 flex flex-wrap gap-6 rounded-md p-8 sm:flex-nowrap"
        >
          <AspectImage
            src={src(proj.cover, "cover")}
            alt={proj.name}
            width={150}
            className="mx-auto flex w-auto flex-shrink-0 items-start justify-center"
          />
          <div className="flex min-w-0 flex-shrink flex-col">
            <p className="mb-2 font-serif text-2xl">
              <Balancer>
                <span className="italic">&quot;{proj.name}&quot;</span> on
                NoNovel.io
              </Balancer>
            </p>
            <p className="flex-grow opacity-80">
              NoNovel.io brings you an expansive collection of carefully curated
              public domain books. Whether you're revisiting old favorites or
              discovering hidden gems, our platform ensures an uninterrupted,
              pure reading experience. Journey through the pages of history and
              imagination, all from the comfort of your device, and all
              completely free.{" "}
            </p>
          </div>
        </Link>
      )}
    </>
  );
}
