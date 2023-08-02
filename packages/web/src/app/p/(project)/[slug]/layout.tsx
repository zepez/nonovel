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
import {
  LayoutWrapper,
  AspectImage,
  CommentLayout,
  BackgroundImage,
} from "~/components/shared";
import { LoginDialog } from "~/components/auth";
import {
  ButtonFollow,
  Blurb,
  ReviewScore,
  LayoutNavigation,
} from "~/components/project";
import { Button } from "~/components/ui/button";
import { summarizeNumber } from "~/lib/number";
import { toTitleCase, naturalListJoin, src } from "~/lib/string";

export const revalidate = 60;

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
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
        text: "Continue reading",
        href: `/p/${project.slug}/chapters/${latestChapterRead.order}`,
      }
    : manifest[0]
    ? {
        text: "Start reading",
        href: `/p/${project.slug}/chapters/${manifest[0]?.order ?? 0}`,
      }
    : null;

  return (
    <>
      <BackgroundImage src={src(project.cover, "cover")}>
        <LayoutWrapper className="flex flex-wrap py-12 md:flex-nowrap md:px-16 lg:px-16">
          <AspectImage
            src={src(project.cover, "cover")}
            alt={project.name}
            width={400}
            className="mx-auto w-48 flex-shrink-0 md:mx-0 md:w-72"
          />
          <div className="ml-0 mt-12 flex flex-col md:ml-16 md:mt-0">
            <h1 className="nn-title mb-1 text-4xl font-bold leading-tight">
              {toTitleCase(project.name)}
            </h1>
            {authors.length > 0 && (
              <p className="mt-3 text-sm">
                By{" "}
                {authors.map(({ user }, relationIdx) =>
                  user?.profile?.username ? (
                    <>
                      <Link
                        key={user.id}
                        href={`/u/${user?.profile?.username ?? ""}`}
                        className="nn-interactive"
                        title="View profile"
                      >
                        @{user?.profile?.username.toLowerCase()}
                      </Link>
                      {naturalListJoin(relationIdx, authors.length)}
                    </>
                  ) : null
                )}
              </p>
            )}
            <p className="nn-text-secondary mt-1">
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

            <div className="nn-divide mt-8 grid w-auto grid-cols-2 gap-4 sm:grid-cols-4 sm:divide-x">
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
              className="nn-text-secondary mt-8 flex-grow"
              slug={params.slug}
            />
            <div className="mt-8 flex flex-wrap gap-4 sm:flex-nowrap">
              {session?.user?.id ? (
                <ButtonFollow
                  className="nn-border w-full border bg-zinc-950/40 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight text-white"
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
                    className="nn-border w-full border bg-zinc-950/40 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight text-white"
                    title="Login or register"
                  >
                    Login to Bookmark
                  </Button>
                </LoginDialog>
              )}
              {readButton && (
                <Link
                  href={readButton.href}
                  className="nn-interactive nn-bg-primary flex w-full items-center justify-center rounded-md border border-zinc-100/10 px-4 py-2 text-center text-sm font-semibold uppercase leading-tight"
                >
                  {readButton.text}
                </Link>
              )}
            </div>
          </div>
        </LayoutWrapper>
      </BackgroundImage>

      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12 md:px-16 lg:px-16">
        <LayoutNavigation slug={project.slug} />
        {children}
        <CommentLayout resourceId={project.id} resourceType="project" />
      </LayoutWrapper>
    </>
  );
}
