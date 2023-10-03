import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import Balancer from "react-wrap-balancer";
import {
  getSession,
  getChapterBySlugs,
  getChapterManifestByIds,
} from "~/lib/server";
import { toTitleCase, src, ec } from "~/lib";
import { ChapterNavigation } from "~/components/chapter";
import {
  LayoutWrapper,
  AspectImage,
  CommentLayout,
  BackgroundImage,
} from "~/components/shared";
import { ChapterView } from "~/components/chapter";

interface ChapterLayoutProps {
  children?: React.ReactNode;
  params: { "project-slug": string; "chapter-slug": string };
}

export default async function ChapterLayout({
  params,
  children,
}: ChapterLayoutProps) {
  const [sessionErr, session] = await getSession();
  const [projectErr, project] = await getChapterBySlugs({
    project: params["project-slug"],
    chapter: params["chapter-slug"],
  });
  if (!project) notFound();

  const chapter = project.chapters[0];
  if (!chapter) notFound();

  const [manifestErr, manifest] = await getChapterManifestByIds({
    projectId: project.id,
  });
  if (!manifest) notFound();

  ec(sessionErr, projectErr, manifestErr);

  return (
    <>
      <ChapterView
        delay={2000}
        userId={session?.user.id}
        projectId={project.id}
        chapterId={chapter.id}
      />
      <BackgroundImage src={src(project.cover)}>
        <LayoutWrapper className="flex flex-wrap items-center pb-8">
          <Link
            href={`/read/${project.slug}`}
            className="nn-interactive mb-4 w-full flex-shrink-0 rounded-md p-1 md:mx-0 md:mb-0 md:w-auto"
            title={project.name}
          >
            <AspectImage
              src={src(project.cover)}
              alt={project.name}
              width={200}
              className="flex w-auto justify-center"
            />
          </Link>
          <div className="mx-auto flex-1 text-center md:ml-12 md:text-left">
            <Balancer as="h1" className="nn-title pb-3 pt-4 italic md:pt-0">
              {toTitleCase(chapter.name)}
            </Balancer>

            <Link
              href={`/read/${project.slug}`}
              className="nn-interactive block text-lg"
            >
              <Balancer as="h2">{toTitleCase(project.name)}</Balancer>
            </Link>

            <p className="nn-detail">
              #{chapter.order} | Uploaded{" "}
              {formatDistanceToNow(chapter.createdAt, { addSuffix: true })}
            </p>
          </div>
        </LayoutWrapper>
      </BackgroundImage>

      <div className="nn-content-wrapper-background">
        <LayoutWrapper className="py-8">
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

      <CommentLayout
        resourceId={chapter.id}
        resourceType="chapter"
        className="pt-8"
      />
    </>
  );
}
