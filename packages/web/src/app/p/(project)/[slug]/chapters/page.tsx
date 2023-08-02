import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import { getProjectBySlug, getChapterManifestByIds } from "~/lib/request";
import { SectionHeading } from "~/components/shared";
import { ListChapters } from "~/components/project";
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
    `Chapters in ${project.name} - start reading today. ${
      project.description ?? ""
    }`,
    160
  );

  return {
    title: `Chapters | ${project.name}`,
    description,
    authors: author ? [{ name: author }] : [],
    openGraph: {
      title: `${project.name} | NoNovel.io`,
      url: `https://nonovel.io/p/${project.slug}/chapters`,
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

  return (
    <>
      <SectionHeading>All Chapters</SectionHeading>
      <ListChapters chapters={manifest} projectSlug={project.slug} />
    </>
  );
}
