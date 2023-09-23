import { cn } from "~/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-nn-backdrop-dark/10 dark:bg-nn-backdrop-light/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
