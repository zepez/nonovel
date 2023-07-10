import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getChapterBySlugAndOrder } from "~/lib/request";

interface ChapterPageProps {
  params: { slug: string; order: string };
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
