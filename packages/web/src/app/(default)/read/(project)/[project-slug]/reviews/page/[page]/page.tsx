import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSession,
  getProjectBySlug,
  getReviewByIds,
  getReviewPageByProjectId,
} from "~/lib/server";
import { toTitleCase, clamp, ec } from "~/lib";
import {
  SectionHeading,
  SectionEmpty,
  LayoutProfileImage,
} from "~/components/shared";
import { LayoutPaginate } from "~/components/shared/layout-paginate";
import { EditReview, ReviewScore, ReviewVote } from "~/components/project";

interface ProjectReviewPageProps {
  params: { "project-slug": string; page: string };
}

export async function generateMetadata({
  params,
}: ProjectReviewPageProps): Promise<Metadata> {
  const [, project] = await getProjectBySlug({ slug: params["project-slug"] });
  if (!project) return {};

  const title = `${toTitleCase(project.name)} - Reviews`;
  const description = clamp(
    `Reviews for ${toTitleCase(project.name)} - see what other people think. ${
      project.description ?? ""
    }`,
    160
  );

  return {
    title,
    description,
    authors: project.penName ? [{ name: project.penName }] : [],
    openGraph: {
      title,
      url: `https://nonovel.io/read/${project.slug}/reviews`,
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

export default async function ProjectReviewPage({
  params,
}: ProjectReviewPageProps) {
  const pageSize = 10;
  const page = parseInt(params.page ?? "1", 10);
  const [sessionErr, session] = await getSession();

  const [projectErr, project] = await getProjectBySlug({
    slug: params["project-slug"],
  });
  if (!project) notFound();

  const [reviewErr, review] = await getReviewByIds({
    userId: session?.user?.id,
    projectId: project.id,
  });

  const [allReviewsErr, allReviews] = await getReviewPageByProjectId({
    projectId: project.id,
    userId: session?.user?.id ?? null,
    page,
    pageSize,
  });

  if (page > 1 && !allReviews?.length) notFound();

  const reviews = allReviews?.slice(0, pageSize) ?? [];

  if (page > 1 && !reviews.length) notFound();

  ec(sessionErr, projectErr, reviewErr, allReviewsErr);

  return (
    <>
      <SectionHeading>Your Review</SectionHeading>
      <EditReview
        userId={session?.user?.id}
        projectId={project.id}
        review={review}
      />

      <SectionHeading>All Reviews</SectionHeading>
      <section className="space-y-6">
        {reviews?.length ? (
          <>
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-nn-secondary flex justify-between rounded-md p-4 pr-2 sm:items-center sm:py-6 sm:pl-8"
              >
                <div className="flex flex-grow sm:space-x-6">
                  <div className="hidden sm:block">
                    <LayoutProfileImage
                      seed={review?.profile?.username}
                      size={50}
                    />
                  </div>
                  <div>
                    <p className="text-md font-bold leading-tight">
                      @{review.profile?.username}
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
              currentPath={`/read/${project.slug}/reviews/page`}
              previousDisabled={page <= 1}
              nextDisabled={reviews.length <= pageSize}
            />
          </>
        ) : (
          <SectionEmpty className="bg-nn-secondary">
            {page === 1
              ? "This book does not have any reviews. Be the first to review it!"
              : "No more reviews found :("}
          </SectionEmpty>
        )}
      </section>
    </>
  );
}
