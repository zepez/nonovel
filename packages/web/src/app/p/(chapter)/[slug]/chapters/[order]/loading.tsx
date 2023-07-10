import { Skeleton } from "~/components/ui/skeleton";

const Paragraph = ({ lines }: { lines: number }) => {
  return (
    <div className="mb-12">
      {Array.from({ length: lines }, () => null).map((_, idx) => (
        <Skeleton key={idx} className="my-4 h-[25px] w-full rounded-full" />
      ))}
    </div>
  );
};

export default function ChapterLoading() {
  return (
    <div className="my-12">
      <Paragraph lines={4} />
      <Paragraph lines={4} />
      <Paragraph lines={4} />
      <Paragraph lines={4} />
    </div>
  );
}
