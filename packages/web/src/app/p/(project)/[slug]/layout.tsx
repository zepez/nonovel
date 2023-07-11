import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getFollowCountByProjectId,
  getFollowStatusByIds,
  getTotalViewCountByProjectId,
  getUserChapterViewsByProjectId,
  getReviewTotalByProjectId,
} from "~/lib/request";
import { LayoutWrapper, AspectImage } from "~/components/shared";
import { ButtonFollow, Blurb, ReviewScore } from "~/components/project";
import { summarizeNumber } from "~/lib/number";
import { toTitleCase, naturalListJoin } from "~/lib/string";

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

  const [, follow] = await getFollowStatusByIds({
    userId: user?.id,
    projectId: project.id,
  });

  const [, userChapterViews] = await getUserChapterViewsByProjectId({
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

  const latest = project.chapters[project.chapters.length - 1];
  const authors = project.users.filter((user) => user.role === "author");

  const readButton = userChapterViews?.length
    ? {
        text: "CONTINUE READING",
        href: `/p/${project.slug}/chapters/${userChapterViews[0].chapter.order}`,
      }
    : {
        text: "START READING",
        href: `/p/${project.slug}/chapters/${project.chapters[0].order}`,
      };

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          className="nn-bg-blurred-2 absolute inset-0 z-0 bg-cover"
          style={{ backgroundImage: `url(${project.cover ?? ""})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="flex flex-wrap py-12 md:flex-nowrap">
            <AspectImage
              src={project.cover}
              alt={project.name}
              width={400}
              className="mx-auto w-48 flex-shrink-0 md:mx-0 md:w-72"
            />
            <div className="ml-0 mt-12 flex flex-col md:ml-16 md:mt-0">
              <h1 className="mb-4 text-4xl font-bold leading-tight">
                {toTitleCase(project.name)}
              </h1>
              <p className="text-sm">
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
              <p className="nn-text-secondary mt-1">
                Updated{" "}
                {formatDistanceToNow(latest.createdAt, { addSuffix: true })}
              </p>

              <div className="flex items-center">
                <ReviewScore
                  readOnly
                  value={reviewTotal.average}
                  style={{ maxWidth: 175 }}
                  className="mt-4"
                  hideHint
                  count={reviewTotal.count}
                />
              </div>

              <div className="nn-divide mt-8 grid w-auto grid-cols-2 gap-4 sm:grid-cols-4 sm:divide-x">
                <div className="pl-4">
                  <p className="text-xs">Chapters</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(project.chapters.length)}
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
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonFollow
                  className="nn-border flex-grow border bg-zinc-950/40 px-4 py-4 text-white"
                  followId={follow?.id}
                  userId={session?.user?.id}
                  projectId={project.id}
                  projectName={toTitleCase(project.name)}
                />
                <Link
                  href={readButton.href}
                  className="nn-interactive nn-bg-primary flex-grow rounded-md border border-zinc-100/10 px-4 py-4 text-center text-sm font-semibold leading-tight"
                >
                  {readButton.text}
                </Link>
              </div>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12 md:px-16 lg:px-16">
        <nav className="flex flex-col gap-4 text-center text-xs font-bold leading-tight sm:flex-row">
          <Link
            href={`/p/${project.slug}`}
            className="nn-bg-background nn-interactive nn-border flex-grow rounded-md py-3"
          >
            ABOUT
          </Link>
          <Link
            href={`/p/${project.slug}/reviews`}
            className="nn-bg-background nn-interactive nn-border flex-grow rounded-md py-3"
          >
            REVIEWS
          </Link>
          <Link
            href={`/p/${project.slug}/chapters`}
            className="nn-bg-background nn-interactive nn-border flex-grow rounded-md py-3"
          >
            CHAPTERS
          </Link>
        </nav>

        {children}
      </LayoutWrapper>
    </>
  );
}
