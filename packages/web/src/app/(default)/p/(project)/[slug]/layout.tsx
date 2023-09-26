import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { FiBookOpen, FiEye } from "react-icons/fi";
import { BsBookmarkHeart } from "react-icons/bs";
import { MdOutlineReviews } from "react-icons/md";
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
  ReviewScore,
  LayoutNavigation,
} from "~/components/project";
import { Button } from "~/components/ui/button";
import { TruncateParagraph } from "~/components/shared";
import { summarizeNumber } from "~/lib/number";
import { toTitleCase, src } from "~/lib/string";

export const revalidate = 60;

interface StatDisplayProps {
  stat: number;
  name: string;
  icon: React.ReactNode;
}

const StatDisplay = ({ stat, name, icon }: StatDisplayProps) => {
  return (
    <div className="min-w-[100px] max-w-[150px] flex-grow">
      <p className="text-nn-accent text-lg font-bold">{name}</p>
      <p className="mt-2 flex items-center justify-center gap-2 text-xl font-bold leading-tight sm:justify-start">
        <span className="text-2xl">{icon}</span> {summarizeNumber(stat)}
      </p>
    </div>
  );
};

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

  const latestChapterRead = manifest
    .filter((item) => item.userChapterViews.length > 0)
    .reverse()[0];

  const readButton = latestChapterRead
    ? {
        text: "Continue",
        href: `/p/${project.slug}/chapters/${latestChapterRead.order}`,
      }
    : manifest[0]
    ? {
        text: "Start",
        href: `/p/${project.slug}/chapters/${manifest[0]?.order ?? 0}`,
      }
    : null;

  return (
    <>
      <BackgroundImage src={src(project.cover, "cover")}>
        <LayoutWrapper className="flex flex-wrap pb-12 md:flex-nowrap">
          <AspectImage
            src={src(project.cover, "cover")}
            alt={project.name}
            width={400}
            className="mx-auto w-60 flex-shrink-0 pb-8 md:w-72 md:pb-0"
          />
          <div className="ml-0 flex flex-col md:ml-8 lg:ml-16">
            <h1 className="nn-title mb-1 text-center italic drop-shadow-2xl sm:text-left">
              <Balancer>{toTitleCase(project.name)}</Balancer>
            </h1>
            <p className="text-center text-lg sm:text-left">
              {toTitleCase(project?.penName ?? "Author Unknown")}
            </p>

            <div className="mt-8 flex flex-wrap justify-start justify-items-start gap-y-8 text-center sm:text-left">
              <div className="flex flex-grow flex-wrap justify-around gap-4">
                <StatDisplay
                  name="Chapters"
                  stat={manifest.length}
                  icon={<FiBookOpen />}
                />
                <StatDisplay name="Views" stat={viewCount} icon={<FiEye />} />
              </div>
              <div className="flex flex-grow flex-wrap justify-around gap-4">
                <StatDisplay
                  name="Bookmarks"
                  stat={followCount}
                  icon={<BsBookmarkHeart />}
                />
                <StatDisplay
                  name="Reviews"
                  stat={reviewTotal.count}
                  icon={<MdOutlineReviews />}
                />
              </div>
            </div>

            <div className="nn-detail mt-8 flex-grow px-4 sm:px-0">
              <TruncateParagraph text={project.description} length={275} />
            </div>

            <div className="flex flex-wrap gap-4 pt-8 sm:flex-nowrap">
              {session?.user?.id ? (
                <ButtonFollow
                  className="bg-nn-secondary w-full px-4 py-2 text-center text-sm font-semibold uppercase leading-tight opacity-80 dark:opacity-100"
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
                    className="bg-nn-secondary w-full px-4 py-2 text-center text-sm font-semibold uppercase leading-tight opacity-80 dark:opacity-100"
                    title="Login or register"
                  >
                    Login to Bookmark
                  </Button>
                </LoginDialog>
              )}
              {readButton && (
                <Link
                  href={readButton.href}
                  className="nn-interactive bg-nn-accent nn-border flex w-full items-center justify-center rounded-md border px-4 py-2 text-center text-sm font-semibold uppercase leading-tight"
                >
                  {readButton.text}
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-8 pt-8">
              <ReviewScore
                readOnly
                value={reviewTotal.average}
                style={{ maxWidth: 120 }}
                hideHint
                count={reviewTotal.count}
              />

              <div className="flex flex-1 items-start justify-end">
                <div className="flex min-w-[200px] flex-wrap gap-x-6 gap-y-3 text-xs">
                  {project.genres.map(({ genre }) => (
                    <div key={genre.id}>
                      <Link
                        href={`/browse/${genre.slug}`}
                        className="nn-interactive"
                      >
                        {genre.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </LayoutWrapper>
      </BackgroundImage>

      <LayoutWrapper>
        <LayoutNavigation slug={project.slug} />
        {children}
      </LayoutWrapper>

      <CommentLayout resourceId={project.id} resourceType="project" />
    </>
  );
}
