import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSession,
  getProjectBySlug,
  getChapterManifestByIds,
} from "~/lib/server";
import { clamp, ec } from "~/lib";
import { SectionHeading } from "~/components/shared";
import { ListChapters } from "~/components/project";

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
  const [sessionErr, session] = await getSession();
  const { user } = session ?? {};

  const [projectErr, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [manifestErr, manifest] = await getChapterManifestByIds({
    userId: user?.id,
    projectId: project.id,
  });

  if (!manifest) notFound();
  ec(sessionErr, projectErr, manifestErr);

  return (
    <>
      <SectionHeading>All Chapters</SectionHeading>
      <ListChapters chapters={manifest} projectSlug={project.slug} />
    </>
  );
}
