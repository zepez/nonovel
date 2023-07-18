import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getReviewByIds,
  getReviewPageByProjectId,
} from "~/lib/request";
import { SectionHeading, AspectImage, SectionEmpty } from "~/components/shared";
import { LayoutPaginate } from "~/components/shared/layout-paginate";
import { EditReview, ReviewScore } from "~/components/project";

interface ProjectReviewPagePageProps {
  params: { slug: string; page: string };
}

export default async function ProjectReviewPagePage({
  params,
}: ProjectReviewPagePageProps) {
  const pageSize = 10;
  const page = parseInt(params.page, 10);
  const [, session] = await getSession();

  const [, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [, review] = await getReviewByIds({
    userId: session?.user?.id,
    projectId: project.id,
  });

  const [, allReviews] = await getReviewPageByProjectId({
    projectId: project.id,
    page,
    pageSize,
  });

  const reviews = allReviews?.slice(0, pageSize) ?? [];

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
          <>
            {reviews.map((review) => (
              <div
                key={review.id}
                className="nn-border-50 nn-bg-background flex items-start justify-start rounded-md p-4 sm:space-x-6 sm:px-8 sm:py-6"
              >
                <AspectImage
                  width={50}
                  className="hidden flex-shrink-0 sm:block"
                  src={review.user?.profile?.image ?? "/profile.png"}
                  alt={`${
                    review.user?.profile?.username ?? ""
                  } profile picture`}
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
                  <p className="whitespace-pre-wrap text-sm">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
            <LayoutPaginate
              currentPage={page}
              previousDisabled={page <= 1}
              nextDisabled={reviews.length <= pageSize}
            />
          </>
        ) : (
          <SectionEmpty className="nn-bg-background">
            {page === 1
              ? "This project does not have any reviews. Be the first to review it!"
              : "No more reviews found :("}
          </SectionEmpty>
        )}
      </section>
    </>
  );
}
