import { Metadata } from "next";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getChapterBySlugAndOrder } from "~/lib/server";
import { clamp, toTitleCase, ec } from "~/lib";

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

  const title = `${chapter.name} - ${project.name}`;
  const description = clamp(
    `Read ${chapter.name}, ${project.name} online for free. ${
      project.description ?? ""
    }`,
    160
  );

  return {
    title,
    description,
    authors: project.penName ? [{ name: project.penName }] : [],
    openGraph: {
      title,
      url: `https://nonovel.io/read/${project.slug}/chapters/${chapter.order}`,
      description,
      authors: project.penName ? [project.penName] : [],
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
  const [projectErr, project] = await getChapterBySlugAndOrder({
    ...params,
    order: parseFloat(params.order),
  });
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  ec(projectErr);

  return (
    <div className="nn-content-wrapper">{parse(chapter.content ?? "")}</div>
  );
}
