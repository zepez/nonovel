import { redirect } from "next/navigation";

interface ProjectReviewPageProps {
  params: { slug: string };
}

export default function ReviewPage({ params }: ProjectReviewPageProps) {
  const { slug } = params;

  redirect(`/p/${slug}/reviews/page/1`);
}
