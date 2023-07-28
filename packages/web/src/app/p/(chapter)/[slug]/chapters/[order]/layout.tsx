import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getSession } from "~/lib/auth";
import {
  getChapterBySlugAndOrder,
  getChapterManifestByIds,
} from "~/lib/request";
import { toTitleCase, src } from "~/lib/string";
import { ChapterNavigation } from "~/components/chapter";
import { LayoutWrapper, AspectImage, CommentLayout } from "~/components/shared";
import { ChapterSettings, ChapterView } from "~/components/chapter";

interface ChapterPageProps {
  children?: React.ReactNode;
  params: { slug: string; order: string };
}

export default async function ChapterLayout({
  params,
  children,
}: ChapterPageProps) {
  const [, session] = await getSession();
  const [, project] = await getChapterBySlugAndOrder({
    ...params,
    order: parseFloat(params.order),
  });
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  const [, manifest] = await getChapterManifestByIds({
    projectId: project.id,
  });
  if (!manifest) notFound();

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
          style={{ backgroundImage: `url(${src(project.cover, "cover")})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="flex flex-wrap items-center justify-between my-12 md:flex-nowrap lg:px-16">
            <div className="flex flex-wrap items-center w-full mb-8 md:mb-0 md:w-auto md:flex-nowrap">
              <Link
                href={`/p/${project.slug}`}
                className="flex-shrink-0 w-full p-1 mb-8 rounded-md nn-interactive md:mx-0 md:mb-0 md:w-auto"
              >
                <AspectImage
                  src={src(project.cover, "cover")}
                  alt={project.name}
                  width={150}
                  className="flex justify-center w-auto"
                />
              </Link>
              <div className="flex-shrink max-w-md mx-auto text-center md:mx-16 md:text-left">
                <Link href={`/p/${project.slug}`} className="nn-interactive">
                  {toTitleCase(project.name)}
                </Link>
                <h1 className="mt-2 text-2xl font-bold leading-tight nn-title">
                  {chapter.name}
                </h1>
                <p className="mt-2 nn-text-secondary">
                  #{chapter.order} | Uploaded{" "}
                  {formatDistanceToNow(chapter.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
            <ChapterSettings className="flex items-center justify-center w-full h-8 rounded-md nn-interactive nn-bg-foreground md:h-12 md:w-12" />
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="py-12 nn-bg-foreground rounded-b-md lg:px-16">
        <ChapterNavigation
          project={project}
          chapter={chapter}
          manifest={manifest}
        />
        {children}
        <ChapterNavigation
          project={project}
          chapter={chapter}
          manifest={manifest}
        />
        <CommentLayout resourceId={chapter.id} resourceType="chapter" />
      </LayoutWrapper>
    </>
  );
}
