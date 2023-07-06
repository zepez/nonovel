import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getFollowCountByProjectId,
  getFollowStatusByIds,
} from "~/lib/request";
import {
  LayoutWrapper,
  SectionHeading,
  AspectImage,
} from "~/components/shared";
import { ButtonFollow, Blurb } from "~/components/project";
import { toTitleCase } from "~/lib/string";

interface ProjectPageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [_sessionErr, session] = await getSession();
  const { user } = session ?? {};

  const [_projectErr, project] = await getProjectBySlug(params);

  if (!project) notFound();

  const [_followErr, follow] = await getFollowStatusByIds({
    userId: user?.id,
    projectId: project.id,
  });

  const [_followCountErr, followCount] = await getFollowCountByProjectId({
    projectId: project.id,
  });

  const latest = project.chapters[project.chapters.length - 1];
  const authors = project.users.filter((user) => user.role === "author");

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
                  <Link
                    key={relationIdx}
                    href={`/u/${user?.profile?.username ?? ""}`}
                    className="nn-interactive"
                  >
                    @{user?.profile?.username.toLowerCase()}
                  </Link>
                ))}
              </p>
              <p className="nn-text-secondary mt-1">
                Updated{" "}
                {formatDistanceToNow(latest.createdAt, { addSuffix: true })}
              </p>

              <div className="nn-divide mt-8 grid w-auto grid-cols-2 gap-4 sm:grid-cols-4 sm:divide-x">
                <div className="pl-4">
                  <p className="text-xs">Chapters</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {project.chapters.length}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Views</p>
                  <p className="mt-2 text-xl font-bold leading-tight">17.3k</p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Followers</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {followCount}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Status</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    Ongoing
                  </p>
                </div>
              </div>

              <div className="flex-grow" />
              <div className="mt-8 grid grid-cols-2 gap-8">
                <ButtonFollow
                  className="border border-zinc-100/20 bg-zinc-950/40 px-4 py-4 text-white"
                  followId={follow?.id}
                  userId={session?.user?.id}
                  projectId={project.id}
                  projectName={toTitleCase(project.name)}
                />
                <Link
                  href={`/p/${project.slug}/chapters/${project.chapters[0].order}`}
                  className="nn-interactive nn-bg-primary rounded-md border border-zinc-100/10 px-4 py-4 text-center text-sm font-semibold leading-tight"
                >
                  START READING
                </Link>
              </div>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12 md:px-16 lg:px-16">
        <Blurb
          className="nn-border nn-bg-background rounded-md border border-zinc-950/20 p-4 dark:border-zinc-100/20"
          slug={params.slug}
        />
        <SectionHeading className="mb-3 mt-8">
          Genre{project.genres.length !== 1 ? "s" : ""}
        </SectionHeading>
        <div className="flex">
          {project.genres.map(({ genre }, genreIdx) => (
            <Link
              key={genreIdx}
              href={`/browse/category/${genre.slug}`}
              className="nn-interactive mx-1 rounded-md p-[2px]"
            >
              <div className="nn-bg-contrast rounded-sm bg-zinc-950 px-3 py-1 text-sm">
                {genre.name.toLowerCase()}
              </div>
            </Link>
          ))}
        </div>
        <SectionHeading className="mb-3 mt-8">Synopsis</SectionHeading>
        <p>{project.description}</p>
        <SectionHeading className="mb-3 mt-8">Chapters</SectionHeading>
        <nav className="grid grid-cols-1">
          {project.chapters.map((chapter, chapterIdx) => (
            <Link
              key={chapterIdx}
              href={`/p/${project.slug}/chapters/${chapter.order}`}
              className="nn-interactive flex items-center"
            >
              <strong className="ml-4 mr-8">{chapter.order}</strong>{" "}
              <h3 className="py-3">{toTitleCase(chapter.name)}</h3>
            </Link>
          ))}
        </nav>
      </LayoutWrapper>
    </>
  );
}
