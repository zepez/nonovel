import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getUserChapterViewsByProjectId,
} from "~/lib/request";
import { SectionHeading } from "~/components/shared";
import { Blurb, ListChapters } from "~/components/project";

interface ProjectPageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [, session] = await getSession();
  const { user } = session ?? {};

  const [_projectErr, project] = await getProjectBySlug(params);

  if (!project) notFound();

  const [, userChapterViews] = await getUserChapterViewsByProjectId({
    userId: user?.id,
    projectId: project.id,
  });

  return (
    <>
      {userChapterViews?.length ? (
        <div className="mt-12 mb-4">
          <Link
            href={`/p/${project.slug}/chapters/${userChapterViews[0].chapter.order}`}
            className="block w-full px-3 py-2 text-center border-dashed rounded-md nn-text-secondary nn-interactive nn-border"
          >
            Resume reading chapter {userChapterViews[0].chapter.order}:{" "}
            {userChapterViews[0].chapter.name}
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
            className="nn-interactive nn-bg-background nn-border mx-1 rounded-sm bg-zinc-950 p-[2px] px-3 py-1 text-sm"
          >
            {genre.name.toLowerCase()}
          </Link>
        ))}
      </section>

      <SectionHeading>Recent Chapters</SectionHeading>
      <ListChapters
        chapters={project.chapters.slice(-3).reverse()}
        userChapterViews={userChapterViews}
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
