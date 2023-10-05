import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSession,
  getProjectBySlug,
  getChapterManifestByIds,
} from "~/lib/server";
import { clamp, ec, toTitleCase } from "~/lib";
import { SectionHeading } from "~/components/shared";
import { ListChapters } from "~/components/project";

interface ProjectPageProps {
  params: { "project-slug": string };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const [, project] = await getProjectBySlug({ slug: params["project-slug"] });
  if (!project) return {};

  const title = `${toTitleCase(project.name)} - Start Reading Today`;
  const description = clamp(project.description, 160);

  return {
    title,
    description,
    authors: project.penName ? [{ name: project.penName }] : [],
    openGraph: {
      title,
      url: `https://nonovel.io/read/${project.slug}`,
      description,
      authors: project.penName ? [project.penName] : [],
      images: [
        {
          url: `/api/og/p?id=${project.id}`,
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

  const [projectErr, project] = await getProjectBySlug({
    slug: params["project-slug"],
  });
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
