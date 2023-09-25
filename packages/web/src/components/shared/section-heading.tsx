import { cn } from "~/lib/utils";

interface SectionHeadingProps {
  className?: string;
  children: React.ReactNode;
}

export const SectionHeading = ({
  className,
  children,
}: SectionHeadingProps) => {
  return (
    <div
      className={cn(
        "mb-4 mt-12 flex items-center text-nn-dark dark:text-nn-primary-dark",
        className
      )}
    >
      <h3 className="mr-3 font-display text-lg">{children}</h3>
      <hr className="h-[1px] flex-grow border-none bg-nn-dark opacity-20 dark:bg-nn-primary-dark" />
    </div>
  );
};
