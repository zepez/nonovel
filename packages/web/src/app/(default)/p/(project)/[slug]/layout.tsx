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
        <LayoutWrapper className="flex flex-wrap py-12 md:flex-nowrap text-nn-dark dark:text-nn-light">
          <AspectImage
            src={src(project.cover, "cover")}
            alt={project.name}
            width={400}
            className="flex-shrink-0 w-48 mx-auto md:mx-0 md:w-72"
          />
          <div className="flex flex-col mt-12 ml-0 md:ml-16 md:mt-0">
            <h1 className="mb-1 text-4xl italic font-bold nn-title">
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
                  className="w-full px-4 py-2 text-sm font-semibold leading-tight text-center uppercase opacity-80 dark:opacity-100 bg-nn-secondary-dark text-nn-light"
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
                    className="w-full px-4 py-2 text-sm font-semibold leading-tight text-center uppercase opacity-80 dark:opacity-100 bg-nn-secondary-dark text-nn-light"
                    title="Login or register"
                  >
                    Login to Bookmark
                  </Button>
                </LoginDialog>
              )}
              {readButton && (
                <Link
                  href={readButton.href}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold leading-tight text-center uppercase border rounded-md nn-interactive nn-bg-primary nn-border"
                >
                  {readButton.text}
                </Link>
              )}
            </div>
          </div>
        </LayoutWrapper>
      </BackgroundImage>

      <LayoutWrapper className="mb-16 border-b border-l border-r nn-bg-foreground nn-border-50 md:rounded-b-md">
        <LayoutNavigation slug={project.slug} />
        {children}
      </LayoutWrapper>

      <CommentLayout resourceId={project.id} resourceType="project" />
    </>
  );
}
