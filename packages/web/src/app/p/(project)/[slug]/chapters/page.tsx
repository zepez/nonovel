import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getUserChapterViewsByProjectId,
} from "~/lib/request";
import { SectionHeading } from "~/components/shared";
import { ListChapters } from "~/components/project";

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
      <SectionHeading>All Chapters</SectionHeading>
      <ListChapters
        chapters={project.chapters}
        userChapterViews={userChapterViews}
        projectSlug={project.slug}
      />
    </>
  );
}
