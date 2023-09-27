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

  const title = `${project.name} - Start Reading Today`;
  const description = clamp(project.description, 160);

  return {
    title,
    description,
    authors: project.penName ? [{ name: project.penName }] : [],
    openGraph: {
      title,
      url: `https://nonovel.io/p/${project.slug}`,
      description,
      authors: project.penName ? [project.penName] : [],
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
