import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import { getProjectBySlug, getChapterManifestByIds } from "~/lib/request";
import { SectionHeading } from "~/components/shared";
import { ListChapters } from "~/components/project";

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

  return (
    <>
      <SectionHeading>All Chapters</SectionHeading>
      <ListChapters chapters={manifest} projectSlug={project.slug} />
    </>
  );
}
