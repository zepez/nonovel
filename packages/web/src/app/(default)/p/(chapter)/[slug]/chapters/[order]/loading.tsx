import { SkeletonParagraph } from "~/components/ui/skeleton-paragraph";

export default function ChapterLoading() {
  return (
    <div className="my-12 space-y-12">
      <SkeletonParagraph lines={4} height={6} />
      <SkeletonParagraph lines={4} height={6} />
      <SkeletonParagraph lines={4} height={6} />
      <SkeletonParagraph lines={4} height={6} />
    </div>
  );
}
