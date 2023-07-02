import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { getProjectById } from "~/lib/request";
import { LayoutWrapper } from "~/components/shared";
import { toTitleCase } from "~/lib/string";

interface ProfilePageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: ProfilePageProps) {
  const [_, project] = await getProjectById({
    slug: params.slug,
  });

  if (!project) notFound();

  const latest = project.chapters[project.chapters.length - 1];
  const authors = project.users.filter((user) => user.role === "author");

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          className="nn-bg-blurred-2 absolute inset-0 z-0"
          style={{ backgroundImage: `url(${project.cover ?? ""})` }}
        />
        <div className="relative z-10">
          <LayoutWrapper className="flex py-12">
            <Image
              src={project.cover ?? ""}
              alt={project.name}
              width={300}
              height={500}
              className="mr-16 min-w-[300px] rounded-md"
            />
            <div>
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
              <p className="nn-text-secondary mb-8">
                Updated{" "}
                {formatDistanceToNow(latest.createdAt, { addSuffix: true })}
              </p>
              <p>{project.description}</p>
            </div>
          </LayoutWrapper>
        </div>
      </div>
      <LayoutWrapper className="nn-bg-foreground rounded-b-md py-12">
        <div className="mx-12">
          <h2 className="mb-2 text-2xl font-bold">Chapters</h2>
          {project.chapters.map((chapter, chapterIdx) => (
            <Link
              key={chapterIdx}
              href={`/p/${project.slug}/c/${chapter.order}`}
              className="nn-interactive nn-border-bottom flex"
            >
              <h3 className="line-clamp-1 px-4 py-3">
                <strong className="mr-4">{chapter.order}</strong>{" "}
                {toTitleCase(chapter.name)}
              </h3>
            </Link>
          ))}
        </div>
      </LayoutWrapper>
    </>
  );
}
