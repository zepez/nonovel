import { Metadata } from "next";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getChapterBySlugAndOrder } from "~/lib/request";
import { clamp, toTitleCase } from "~/lib/string";

interface ChapterPageProps {
  params: { slug: string; order: string };
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const [, project] = await getChapterBySlugAndOrder({
    ...params,
    order: parseFloat(params.order),
  });
  if (!project) return {};

  const chapter = project.chapters[0];
  if (!chapter) return {};

  const author = project.penName ?? null;

  const description = clamp(
    `Read ${project.name} online for free. ${project.description ?? ""}`,
    160
  );

  return {
    title: `${chapter.name}, ${project.name}`,
    description,
    authors: author ? [{ name: author }] : [],
    openGraph: {
      title: `${chapter.name}, ${project.name} | NoNovel.io`,
      url: `https://nonovel.io/p/${project.slug}/chapters/${chapter.order}`,
      description,
      authors: author ? [author] : [],
      images: [
        {
          url: `/api/og/p?title=${project.name}&image=${
            project.cover as string
          }&chapter=${toTitleCase(chapter.name)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const [, project] = await getChapterBySlugAndOrder({
    ...params,
    order: parseFloat(params.order),
  });
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  return (
    <>
      <div className="nn-content-wrapper">{parse(chapter.content ?? "")}</div>
    </>
  );
}
