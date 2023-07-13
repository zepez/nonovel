import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import { getProjectBySlug, getChapterManifestByIds } from "~/lib/request";
import { SectionHeading } from "~/components/shared";
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
        <div className="mb-4 mt-12">
          <Link
            href={`/p/${project.slug}/chapters/${latestChapterRead.order}`}
            className="nn-text-secondary nn-interactive nn-border block w-full rounded-md border border-dashed px-3 py-2 text-center"
          >
            Resume reading chapter {latestChapterRead.order}:{" "}
            {latestChapterRead.name}
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
      <section className="flex">
        {project.genres.map(({ genre }) => (
          <Link
            key={genre.id}
            href={`/browse/category/${genre.slug}`}
            className="nn-interactive nn-bg-background nn-border-50 mx-1 rounded-sm bg-zinc-950 px-4 py-2 text-xs font-bold uppercase leading-tight"
          >
            {genre.name.toLowerCase()}
          </Link>
        ))}
      </section>

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
  );
}
