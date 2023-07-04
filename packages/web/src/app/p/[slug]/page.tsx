import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProjectById } from "~/lib/request";
import { LayoutWrapper } from "~/components/shared";
import { toTitleCase } from "~/lib/string";

interface ProjectPageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [_, project] = await getProjectById(params);

  if (!project) notFound();

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
            <Image
              src={project.cover ?? ""}
              alt={project.name}
              width={300}
              height={500}
              className="mx-auto w-48 flex-shrink-0 rounded-md md:mx-0 md:w-72"
            />
            <div className="ml-0 mt-12 md:ml-16 md:mt-0">
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
              <div className="m-1 mt-4 flex">
                {project.genres.map(({ genre }, genreIdx) => (
                  <Link
                    key={genreIdx}
                    href={`/browse/category/${genre.slug}`}
                    className="nn-interactive rounded-md p-[2px]"
                  >
                    <div className="nn-bg-foreground rounded-md px-2 py-1 text-xs">
                      {genre.name}
                    </div>
                  </Link>
                ))}
              </div>
              <p className="mt-8">{project.description}</p>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12 md:px-16 lg:px-16">
        <h2 className="mb-2 text-2xl font-bold">Chapters</h2>
        <nav className="grid grid-cols-1 divide-y divide-zinc-500/50">
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
