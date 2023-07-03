import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getChapterBySlugAndOrder } from "~/lib/request";
import { toTitleCase } from "~/lib/string";
import { LayoutWrapper } from "~/components/shared";
import { ChapterSettings } from "~/components/chapter";

interface ChapterPageProps {
  params: { slug: string; order: string };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const [_, project] = await getChapterBySlugAndOrder(params);
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  return (
    <LayoutWrapper className="nn-bg-foreground mt-12 rounded-md py-8">
      <div className="nn-border-bottom mb-4 flex flex-wrap justify-between pb-4">
        <div>
          <Link href={`/p/${project.slug}`} className="text-sm">
            {toTitleCase(project.name)}
          </Link>
          <h1 className="mt-2 text-2xl font-bold leading-tight">
            Chapter {chapter.order} - {chapter.name}
          </h1>
        </div>
        <ChapterSettings />
      </div>
      <div className="nn-content-wrapper">{parse(chapter.content ?? "")}</div>
    </LayoutWrapper>
  );
}
