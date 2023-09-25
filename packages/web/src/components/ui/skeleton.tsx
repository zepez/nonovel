import { cn } from "~/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-nn-base-dark/10 dark:bg-nn-base-light/10",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
