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
    <div className={cn("mb-4 mt-12 flex items-center text-nn-dark dark:text-nn-primary-dark", className)}>
      <h3 className="mr-3 text-lg nn-title">{children}</h3>
      <hr className="bg-nn-dark dark:bg-nn-primary-dark h-[1px] flex-grow border-none opacity-20" />
    </div>
  );
};
