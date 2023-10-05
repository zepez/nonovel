import { Metadata } from "next";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getChapterBySlugs } from "~/lib/server";
import { clamp, toTitleCase, ec } from "~/lib";

interface ChapterPageProps {
  params: { "project-slug": string; "chapter-slug": string };
}

export async function generateMetadata({
  params,
}: ChapterPageProps): Promise<Metadata> {
  const [, project] = await getChapterBySlugs({
    project: params["project-slug"],
    chapter: params["chapter-slug"],
  });
  if (!project) return {};

  const chapter = project.chapters[0];
  if (!chapter) return {};

  const title = `${toTitleCase(chapter.name)} - ${toTitleCase(project.name)}`;
  const description = clamp(
    `Read ${toTitleCase(chapter.name)}, ${toTitleCase(
      project.name
    )} online for free. ${project.description ?? ""}`,
    160
  );

  return {
    title,
    description,
    authors: project.penName ? [{ name: project.penName }] : [],
    openGraph: {
      title,
      url: `https://nonovel.io/read/${project.slug}/chapter/${chapter.slug}`,
      description,
      authors: project.penName ? [project.penName] : [],
      images: [
        {
          url: `/api/og/p?id=${project.id}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const [projectErr, project] = await getChapterBySlugs({
    project: params["project-slug"],
    chapter: params["chapter-slug"],
  });
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  ec(projectErr);

  return (
    <div className="nn-content-wrapper">{parse(chapter.content ?? "")}</div>
  );
}
