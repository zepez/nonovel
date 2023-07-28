import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getFollowCountByProjectId,
  getFollowStatusByIds,
  getTotalViewCountByProjectId,
  getReviewTotalByProjectId,
  getChapterManifestByIds,
} from "~/lib/request";
import { LayoutWrapper, AspectImage, CommentLayout } from "~/components/shared";
import { LoginDialog } from "~/components/auth";
import {
  ButtonFollow,
  Blurb,
  ReviewScore,
  LayoutNavigation,
} from "~/components/project";
import { Button } from "~/components/ui/button";
import { summarizeNumber } from "~/lib/number";
import { toTitleCase, naturalListJoin, src, clamp } from "~/lib/string";

export const revalidate = 60;

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProjectLayoutProps): Promise<Metadata> {
  const [, project] = await getProjectBySlug(params);
  if (!project) return {};

  const author =
    project.penName ?? project.users[0]?.user?.profile?.username ?? null;

  const description = clamp(
    `Read ${project.name} online for free. ${project.description ?? ""}`,
    160
  );

  return {
    title: project.name,
    description,
    authors: author ? [{ name: author }] : [],
    openGraph: {
      title: `${project.name} | NoNovel.io`,
      url: `https://nonovel.io/p/${project.slug}`,
      description,
      authors: author ? [author] : [],
      images: [
        {
          url: `/api/og/p?title=${project.name}&image=${
            project.cover as string
          }`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const [, session] = await getSession();
  const { user } = session ?? {};

  const [, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [, manifest] = await getChapterManifestByIds({
    userId: user?.id,
    projectId: project.id,
  });
  if (!manifest) notFound();

  const [, follow] = await getFollowStatusByIds({
    userId: user?.id,
    projectId: project.id,
  });

  const [, followCount] = await getFollowCountByProjectId({
    projectId: project.id,
  });

  const [, viewCount] = await getTotalViewCountByProjectId({
    projectId: project.id,
  });

  const [, reviewTotal] = await getReviewTotalByProjectId({
    projectId: project.id,
  });

  const authors = project.users.filter((user) => user.role === "author");

  const latestChapter = manifest[manifest.length - 1] ?? null;
  const latestChapterRead = manifest
    .filter((item) => item.userChapterViews.length > 0)
    .reverse()[0];

  const readButton = latestChapterRead
    ? {
        text: "CONTINUE READING",
        href: `/p/${project.slug}/chapters/${latestChapterRead.order}`,
      }
    : manifest[0]
    ? {
        text: "START READING",
        href: `/p/${project.slug}/chapters/${manifest[0]?.order ?? 0}`,
      }
    : null;

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover nn-bg-blurred-2"
          style={{ backgroundImage: `url(${src(project.cover ?? "")})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="flex flex-wrap py-12 md:flex-nowrap md:px-16 lg:px-16">
            <AspectImage
              src={project.cover}
              alt={project.name}
              width={400}
              className="flex-shrink-0 w-48 mx-auto md:mx-0 md:w-72"
            />
            <div className="flex flex-col mt-12 ml-0 md:ml-16 md:mt-0">
              <h1 className="mb-1 text-4xl font-bold leading-tight nn-title">
                {toTitleCase(project.name)}
              </h1>
              {authors.length > 0 && (
                <p className="mt-3 text-sm">
                  By{" "}
                  {authors.map(({ user }, relationIdx) => (
                    <>
                      <Link
                        key={user.id}
                        href={`/u/${user?.profile?.username ?? ""}`}
                        className="nn-interactive"
                      >
                        @{user?.profile?.username.toLowerCase()}
                      </Link>
                      {naturalListJoin(relationIdx, authors.length)}
                    </>
                  ))}
                </p>
              )}
              <p className="mt-1 nn-text-secondary">
                Updated{" "}
                {formatDistanceToNow(
                  latestChapter?.createdAt ?? project.updatedAt,
                  {
                    addSuffix: true,
                  }
                )}
              </p>

              <div className="flex items-center">
                <ReviewScore
                  readOnly
                  value={reviewTotal.average}
                  style={{ maxWidth: 150 }}
                  className="mt-5"
                  hideHint
                  count={reviewTotal.count}
                />
              </div>

              <div className="grid w-auto grid-cols-2 gap-4 mt-8 nn-divide sm:grid-cols-4 sm:divide-x">
                <div className="pl-4">
                  <p className="text-xs">Chapters</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(manifest.length)}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Views</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(viewCount)}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Bookmarks</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(followCount)}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Reviews</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(reviewTotal.count)}
                  </p>
                </div>
              </div>
              <Blurb
                className="flex-grow mt-8 nn-text-secondary"
                slug={params.slug}
              />
              <div className="flex flex-wrap gap-4 mt-8 sm:flex-nowrap">
                {session?.user?.id ? (
                  <ButtonFollow
                    className="w-full px-4 py-2 text-sm font-semibold leading-tight text-center text-white uppercase border nn-border bg-zinc-950/40"
                    followId={follow?.id}
                    userId={session?.user?.id}
                    projectId={project.id}
                    projectName={toTitleCase(project.name)}
                  />
                ) : (
                  <LoginDialog>
                    <Button
                      variant="ghost"
                      size="fluid"
                      className="w-full px-4 py-2 text-sm font-semibold leading-tight text-center text-white uppercase border nn-border bg-zinc-950/40"
                    >
                      Login to Bookmark
                    </Button>
                  </LoginDialog>
                )}
                {readButton && (
                  <Link
                    href={readButton.href}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold leading-tight text-center border rounded-md nn-interactive nn-bg-primary border-zinc-100/10 "
                  >
                    {readButton.text}
                  </Link>
                )}
              </div>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="py-12 nn-bg-foreground rounded-b-md md:px-16 lg:px-16">
        <LayoutNavigation slug={project.slug} />
        {children}
        <CommentLayout resourceId={project.id} resourceType="project" />
      </LayoutWrapper>
    </>
  );
}
