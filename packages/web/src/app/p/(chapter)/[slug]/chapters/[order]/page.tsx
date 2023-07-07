import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { formatDistanceToNow } from "date-fns";
import { getSession } from "~/lib/auth";
import { getChapterBySlugAndOrder } from "~/lib/request";
import { toTitleCase } from "~/lib/string";
import { LayoutWrapper, AspectImage } from "~/components/shared";
import { ChapterSettings, ChapterView } from "~/components/chapter";

interface ChapterPageProps {
  params: { slug: string; order: string };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const [_sessionErr, session] = await getSession();
  const [_projectErr, project] = await getChapterBySlugAndOrder(params);
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  return (
    <>
      <ChapterView
        delay={2000}
        userId={session?.user.id}
        projectId={project.id}
        chapterId={chapter.id}
      />
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover nn-bg-blurred-2"
          style={{ backgroundImage: `url(${project.cover ?? ""})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="flex flex-wrap items-center justify-between my-12 md:flex-nowrap">
            <div className="flex flex-wrap items-center w-full mb-8 md:mb-0 md:w-auto md:flex-nowrap">
              <Link
                href={`/p/${project.slug}`}
                className="flex-shrink-0 w-full p-1 mb-8 rounded-md nn-interactive md:mx-0 md:mb-0 md:w-auto"
              >
                <AspectImage
                  src={project.cover}
                  alt={project.name}
                  width={150}
                  className="flex justify-center w-auto"
                />
              </Link>
              <div className="flex-shrink max-w-md mx-auto text-center md:mx-16 md:text-left">
                <Link href={`/p/${project.slug}`} className="nn-interactive">
                  {toTitleCase(project.name)}
                </Link>
                <h1 className="mt-2 text-2xl font-bold leading-tight">
                  Chapter {chapter.order} - {chapter.name}
                </h1>
                <p className="mt-2 nn-text-secondary">
                  Uploaded{" "}
                  {formatDistanceToNow(chapter.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <ChapterSettings className="flex items-center justify-center w-full h-8 rounded-md nn-interactive nn-bg-foreground md:h-12 md:w-12" />
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="py-6 nn-bg-foreground rounded-b-md lg:px-16">
        <div className="nn-content-wrapper">{parse(chapter.content ?? "")}</div>
      </LayoutWrapper>
    </>
  );
}
