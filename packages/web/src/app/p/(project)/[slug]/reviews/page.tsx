import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import { getProjectBySlug, getReviewByIds } from "~/lib/request";
import { SectionHeading } from "~/components/shared";
import { EditReview } from "~/components/project";

interface ProjectReviewPageProps {
  params: { slug: string };
}

export default async function ProjectReviewPage({
  params,
}: ProjectReviewPageProps) {
  const [, session] = await getSession();

  const [_projectErr, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [_reviewErr, review] = await getReviewByIds({
    userId: session?.user?.id,
    projectId: project.id,
  });

  return (
    <>
      <SectionHeading>Your review</SectionHeading>
      <EditReview
        userId={session?.user?.id}
        projectId={project.id}
        review={review}
      />

      <SectionHeading>All reviews</SectionHeading>
      <div className="p-4 text-center rounded-md nn-bg-background nn-border nn-text-secondary">
        This project does not have any reviews. Be the first to review it!
      </div>
    </>
  );
}
