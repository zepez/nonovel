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
} from "~/lib/request";
import { LayoutWrapper, AspectImage } from "~/components/shared";
import { ButtonFollow, Blurb } from "~/components/project";
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
          className="absolute inset-0 z-0 bg-cover nn-bg-blurred-2"
          style={{ backgroundImage: `url(${project.cover ?? ""})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="flex flex-wrap py-12 md:flex-nowrap">
            <AspectImage
              src={project.cover}
              alt={project.name}
              width={400}
              className="flex-shrink-0 w-48 mx-auto md:mx-0 md:w-72"
            />
            <div className="flex flex-col mt-12 ml-0 md:ml-16 md:mt-0">
              <h1 className="mb-4 text-4xl font-bold leading-tight">
                {toTitleCase(project.name)}
              </h1>
              <p className="text-sm">
                By{" "}
                {authors.map(({ user }, relationIdx) => (
                  <>
                    <Link
                      key={relationIdx}
                      href={`/u/${user?.profile?.username ?? ""}`}
                      className="nn-interactive"
                    >
                      @{user?.profile?.username.toLowerCase()}
                    </Link>
                    {naturalListJoin(relationIdx, authors.length)}
                  </>
                ))}
              </p>
              <p className="mt-1 nn-text-secondary">
                Updated{" "}
                {formatDistanceToNow(latest.createdAt, { addSuffix: true })}
              </p>

              <div className="grid w-auto grid-cols-2 gap-4 mt-8 nn-divide sm:grid-cols-4 sm:divide-x">
                <div className="pl-4">
                  <p className="text-xs">Chapters</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(project.chapters.length)}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Total Views</p>
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
                  <p className="text-xs">Status</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {toTitleCase(project.progress)}
                  </p>
                </div>
              </div>

              <Blurb className="flex-grow mt-8" slug={params.slug} />
              <div className="grid grid-cols-2 gap-8 mt-8">
                <ButtonFollow
                  className="px-4 py-4 text-white border border-zinc-100/20 bg-zinc-950/40"
                  followId={follow?.id}
                  userId={session?.user?.id}
                  projectId={project.id}
                  projectName={toTitleCase(project.name)}
                />
                <Link
                  href={readButton.href}
                  className="px-4 py-4 text-sm font-semibold leading-tight text-center border rounded-md nn-interactive nn-bg-primary border-zinc-100/10"
                >
                  {readButton.text}
                </Link>
              </div>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="py-12 nn-bg-foreground rounded-b-md md:px-16 lg:px-16">
        <nav className="grid grid-cols-3 gap-4 text-xs font-bold leading-tight text-center">
          <Link
            href={`/p/${project.slug}`}
            className="py-3 rounded-md nn-bg-background nn-interactive nn-border"
          >
            ABOUT
          </Link>
          <Link
            href={`/p/${project.slug}/reviews`}
            className="py-3 rounded-md nn-bg-background nn-interactive nn-border"
          >
            REVIEWS
          </Link>
          <Link
            href={`/p/${project.slug}/chapters`}
            className="py-3 rounded-md nn-bg-background nn-interactive nn-border"
          >
            CHAPTERS
          </Link>
        </nav>

        {children}
      </LayoutWrapper>
    </>
  );
}
