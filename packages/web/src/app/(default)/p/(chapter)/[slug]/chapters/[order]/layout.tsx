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
import {
  LayoutWrapper,
  AspectImage,
  CommentLayout,
  BackgroundImage,
} from "~/components/shared";
import { ChapterSettings, ChapterView } from "~/components/chapter";

interface ChapterLayoutProps {
  children?: React.ReactNode;
  params: { slug: string; order: string };
}

export default async function ChapterLayout({
  params,
  children,
}: ChapterLayoutProps) {
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
      <BackgroundImage src={src(project.cover, "cover")}>
        <LayoutWrapper className="flex flex-wrap items-center justify-between py-12 md:flex-nowrap">
          <div className="flex flex-wrap items-center w-full mb-8 md:mb-0 md:w-auto md:flex-nowrap">
            <Link
              href={`/p/${project.slug}`}
              className="flex-shrink-0 w-full p-1 mb-8 rounded-md nn-interactive md:mx-0 md:mb-0 md:w-auto"
              title={project.name}
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
              <h1 className="mt-2 text-2xl italic font-bold nn-title">
                {toTitleCase(chapter.name)}
              </h1>
              <p className="mt-2 nn-text-secondary">
                #{chapter.order} | Uploaded{" "}
                {formatDistanceToNow(chapter.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
          <ChapterSettings className="flex items-center justify-center w-full h-8 rounded-md nn-interactive nn-bg-foreground md:h-12 md:w-12" />
        </LayoutWrapper>
      </BackgroundImage>

      <div className="nn-content-wrapper-background text-nn-dark dark:text-nn-light">
        <LayoutWrapper className="pb-16 md:rounded-b-md">
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
        </LayoutWrapper>
      </div>

      <CommentLayout resourceId={chapter.id} resourceType="chapter" />
    </>
  );
}
