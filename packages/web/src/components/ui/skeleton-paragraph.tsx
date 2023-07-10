import { cn } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";

const SkeletonParagraph = ({
  lines,
  height,
}: {
  lines: number;
  height: number;
}) => {
  return (
    <div>
      {Array.from({ length: lines }, () => null).map((_, idx) => (
        <Skeleton
          key={idx}
          className={cn(
            idx === lines - 1 ? "w-2/3" : "w-full",
            `h-${height}`,
            "my-4 rounded-full"
          )}
        />
      ))}
    </div>
  );
};

export { SkeletonParagraph };
