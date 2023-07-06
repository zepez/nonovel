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
import { summarizeNumber } from "~/lib/number";
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
                  <Link
                    key={relationIdx}
                    href={`/u/${user?.profile?.username ?? ""}`}
                    className="nn-interactive"
                  >
                    @{user?.profile?.username.toLowerCase()}
                  </Link>
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
                  <p className="text-xs">Views</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(17400)}
                  </p>
                </div>
                <div className="pl-4">
                  <p className="text-xs">Followers</p>
                  <p className="mt-2 text-xl font-bold leading-tight">
                    {summarizeNumber(followCount)}
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
              <div className="grid grid-cols-2 gap-8 mt-8">
                <ButtonFollow
                  className="px-4 py-4 text-white border border-zinc-100/20 bg-zinc-950/40"
                  followId={follow?.id}
                  userId={session?.user?.id}
                  projectId={project.id}
                  projectName={toTitleCase(project.name)}
                />
                <Link
                  href={`/p/${project.slug}/chapters/${project.chapters[0].order}`}
                  className="px-4 py-4 text-sm font-semibold leading-tight text-center border rounded-md nn-interactive nn-bg-primary border-zinc-100/10"
                >
                  START READING
                </Link>
              </div>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="py-12 nn-bg-foreground rounded-b-md md:px-16 lg:px-16">
        <Blurb
          className="p-4 border rounded-md nn-border nn-bg-background border-zinc-950/20 dark:border-zinc-100/20"
          slug={params.slug}
        />
        <SectionHeading className="mt-8 mb-3">
          Genre{project.genres.length !== 1 ? "s" : ""}
        </SectionHeading>
        <div className="flex">
          {project.genres.map(({ genre }, genreIdx) => (
            <Link
              key={genreIdx}
              href={`/browse/category/${genre.slug}`}
              className="nn-interactive mx-1 rounded-md p-[2px]"
            >
              <div className="px-3 py-1 text-sm rounded-sm nn-bg-contrast bg-zinc-950">
                {genre.name.toLowerCase()}
              </div>
            </Link>
          ))}
        </div>
        <SectionHeading className="mt-8 mb-3">Synopsis</SectionHeading>
        <p>{project.description}</p>
        <SectionHeading className="mt-8 mb-3">Chapters</SectionHeading>
        <nav className="grid grid-cols-1">
          {project.chapters.map((chapter, chapterIdx) => (
            <Link
              key={chapterIdx}
              href={`/p/${project.slug}/chapters/${chapter.order}`}
              className="flex items-center nn-interactive"
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
