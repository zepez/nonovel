import { notFound } from "next/navigation";
import { getProjectBySlug } from "~/lib/request";
import { SectionHeading } from "~/components/shared";
import { ListChapters } from "~/components/project";

interface ProjectPageProps {
  params: { slug: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const [_projectErr, project] = await getProjectBySlug(params);

  if (!project) notFound();

  return (
    <>
      <SectionHeading className="my-8">All Chapters</SectionHeading>
      <ListChapters chapters={project.chapters} projectSlug={project.slug} />
    </>
  );
}
