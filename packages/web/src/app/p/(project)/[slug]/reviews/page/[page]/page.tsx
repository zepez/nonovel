import { notFound } from "next/navigation";
import { getSession } from "~/lib/auth";
import {
  getProjectBySlug,
  getReviewByIds,
  getReviewPageByProjectId,
} from "~/lib/request";
import { src } from "~/lib/string";
import { SectionHeading, AspectImage, SectionEmpty } from "~/components/shared";
import { LayoutPaginate } from "~/components/shared/layout-paginate";
import { EditReview, ReviewScore, ReviewVote } from "~/components/project";

interface ProjectReviewPagePageProps {
  params: { slug: string; page: string };
}

export default async function ProjectReviewPagePage({
  params,
}: ProjectReviewPagePageProps) {
  const pageSize = 10;
  const page = parseInt(params.page ?? "1", 10);
  const [, session] = await getSession();

  const [, project] = await getProjectBySlug(params);
  if (!project) notFound();

  const [, review] = await getReviewByIds({
    userId: session?.user?.id,
    projectId: project.id,
  });

  const [, allReviews] = await getReviewPageByProjectId({
    projectId: project.id,
    userId: session?.user?.id ?? null,
    page,
    pageSize,
  });
  if (page > 1 && !allReviews?.length) notFound();

  const reviews = allReviews?.slice(0, pageSize) ?? [];
  if (page > 1 && !reviews.length) notFound();

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
                className="flex justify-between p-4 pr-2 rounded-md nn-border-50 nn-bg-background sm:items-center sm:py-6 sm:pl-8"
              >
                <div className="flex flex-grow sm:space-x-6">
                  <AspectImage
                    width={50}
                    className="flex-shrink-0 hidden sm:block"
                    src={src(review.profile?.image, "profile")}
                    alt={`${review.profile?.username ?? ""} profile picture`}
                  />
                  <div>
                    <p className="font-bold leading-tight text-md">
                      @{review.profile?.username}
                    </p>
                    <ReviewScore
                      className="my-3 text-xs"
                      value={review.score}
                      readOnly
                    />
                    <p className="text-sm whitespace-pre-wrap">
                      {review.comment}
                    </p>
                  </div>
                </div>
                <ReviewVote
                  size={50}
                  voteCurrent={review.voteCurrent}
                  voteTotal={review.voteTotal}
                  userId={session?.user?.id ?? null}
                  resourceId={review.id}
                />
              </div>
            ))}
            <LayoutPaginate
              currentPage={page}
              currentPath={`/p/${project.slug}/reviews/page`}
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
