import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getReviewByIds,
  getReviewPageByProjectId,
} from "~/lib/request";
import { SectionHeading, AspectImage } from "~/components/shared";
import { EditReview, ReviewScore } from "~/components/project";

interface ProjectReviewPageProps {
  params: { slug: string };
}

export default async function ProjectReviewPage({
  params,
}: ProjectReviewPageProps) {
  const [, session] = await getSession();

  const [, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [, review] = await getReviewByIds({
    userId: session?.user?.id,
    projectId: project.id,
  });

  const [, reviews] = await getReviewPageByProjectId({
    projectId: project.id,
    page: 1,
    pageSize: 10,
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
      <section className="space-y-6">
        {reviews?.length ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="items-top nn-border nn-bg-background flex justify-start space-x-6 rounded-md p-4 sm:px-8 sm:py-6"
            >
              <AspectImage
                width={50}
                className="flex-shrink-0"
                src={review.user?.profile?.image ?? "/profile.png"}
                alt={`${review.user?.profile?.username ?? ""} profile picture`}
              />
              <div>
                <p className="text-md font-bold leading-tight">
                  @{review.user?.profile?.username}
                </p>
                <ReviewScore
                  className="my-3 text-xs"
                  value={review.score}
                  readOnly
                />
                <p className="whitespace-pre-wrap text-sm">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="nn-bg-background nn-border nn-text-secondary rounded-md p-4 text-center">
            This project does not have any reviews. Be the first to review it!
          </div>
        )}
      </section>
    </>
  );
}
