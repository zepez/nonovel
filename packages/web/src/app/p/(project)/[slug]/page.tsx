import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import { getProjectBySlug, getChapterManifestByIds } from "~/lib/request";
import { SectionEmpty, SectionHeading } from "~/components/shared";
import { Blurb, ListChapters } from "~/components/project";

interface ProjectPageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [, session] = await getSession();
  const { user } = session ?? {};

  const [, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [, manifest] = await getChapterManifestByIds({
    userId: user?.id,
    projectId: project.id,
  });
  if (!manifest) notFound();

  const latestChapterRead = manifest
    .filter((item) => item.userChapterViews.length > 0)
    .reverse()[0];

  return (
    <>
      {latestChapterRead ? (
        <div className="mt-12 mb-4">
          <Link
            href={`/p/${project.slug}/chapters/${latestChapterRead.order}`}
            className="flex items-center justify-between w-full px-3 py-2 border border-dashed rounded-md nn-text-secondary nn-interactive nn-border"
          >
            Resume reading {latestChapterRead.name}{" "}
            <span className="mx-4 text-xs">#{latestChapterRead.order}</span>
          </Link>
        </div>
      ) : null}

      <SectionHeading>Synopsis</SectionHeading>
      <section>
        {project.description ? (
          <p>{project.description}</p>
        ) : (
          <Blurb slug={params.slug} />
        )}
      </section>

      <SectionHeading>
        Genre{project.genres.length !== 1 ? "s" : ""}
      </SectionHeading>
      {project.genres.length > 0 ? (
        <section className="flex flex-wrap gap-3">
          {project.genres.map(({ genre }) => (
            <Link
              key={genre.id}
              href={`/browse/${genre.slug}`}
              className="px-4 py-2 text-xs font-bold leading-tight uppercase rounded-sm nn-interactive nn-bg-background nn-border-50 bg-zinc-950"
              title={`Browse ${genre.name.toLowerCase()}`}
            >
              {genre.name}
            </Link>
          ))}
        </section>
      ) : (
        <SectionEmpty className="nn-bg-background">
          This project does not have any known genres, yet.
        </SectionEmpty>
      )}

      {project.progress !== "finished" && (
        <>
          <SectionHeading>Recent Chapters</SectionHeading>
          <ListChapters
            chapters={manifest.slice(-3).reverse()}
            disabledSearch
            itemHeight={1}
            projectSlug={project.slug}
            additionalItems={[
              {
                name: "View All",
                href: `/p/${project.slug}/chapters`,
                symbol: "...",
              },
            ]}
          />
        </>
      )}
    </>
  );
}
