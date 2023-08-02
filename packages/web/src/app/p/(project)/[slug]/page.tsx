import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import { getProjectBySlug, getChapterManifestByIds } from "~/lib/request";
import { SectionEmpty, SectionHeading } from "~/components/shared";
import { Blurb, ListChapters } from "~/components/project";
import { clamp } from "~/lib/string";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const [, project] = await getProjectBySlug(params);
  if (!project) return {};

  const author =
    project.penName ?? project.users[0]?.user?.profile?.username ?? null;

  const description = clamp(
    `Read ${project.name} online for free. ${project.description ?? ""}`,
    160
  );

  return {
    title: project.name,
    description,
    authors: author ? [{ name: author }] : [],
    openGraph: {
      title: `${project.name} | NoNovel.io`,
      url: `https://nonovel.io/p/${project.slug}`,
      description,
      authors: author ? [author] : [],
      images: [
        {
          url: `/api/og/p?title=${project.name}&image=${
            project.cover as string
          }`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
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
            className="nn-text-secondary nn-interactive nn-border flex w-full items-center justify-between rounded-md border border-dashed px-3 py-2"
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
              className="nn-interactive nn-bg-background nn-border-50 rounded-sm bg-zinc-950 px-4 py-2 text-xs font-bold uppercase leading-tight"
              title={`Browse ${genre.name.toLowerCase()}`}
            >
              {genre.name}
            </Link>
          ))}
        </section>
      ) : (
        <SectionEmpty className="nn-bg-foreground">
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
