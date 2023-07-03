import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { formatDistanceToNow } from "date-fns";
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
    <>
      <div className="relative overflow-hidden">
        <div
          className="nn-bg-blurred-2 absolute inset-0 z-0"
          style={{ backgroundImage: `url(${project.cover ?? ""})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="my-12 flex flex-wrap items-center justify-between md:flex-nowrap">
            <div className="mb-8 flex w-full flex-wrap items-center md:mb-0 md:w-auto md:flex-nowrap">
              <Link
                href={`/p/${project.slug}`}
                className="nn-interactive mb-8 w-full flex-shrink-0 rounded-md p-1 md:mx-0 md:mb-0 md:w-auto"
              >
                <Image
                  src={project.cover ?? ""}
                  alt={project.name}
                  width={150}
                  height={225}
                  className="mx-auto min-w-[150] rounded-md"
                />
              </Link>
              <div className="mx-auto max-w-md flex-shrink text-center md:mx-16 md:text-left">
                <Link href={`/p/${project.slug}`} className="nn-interactive">
                  {toTitleCase(project.name)}
                </Link>
                <h1 className="mt-2 text-2xl font-bold leading-tight">
                  Chapter {chapter.order} - {chapter.name}
                </h1>
                <p className="nn-text-secondary mt-2">
                  Uploaded{" "}
                  {formatDistanceToNow(chapter.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <ChapterSettings className="nn-interactive nn-bg-foreground flex h-8 w-full items-center justify-center rounded-md md:h-12 md:w-12" />
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-6 lg:px-16">
        <div className="nn-content-wrapper">{parse(chapter.content ?? "")}</div>
      </LayoutWrapper>
    </>
  );
}
