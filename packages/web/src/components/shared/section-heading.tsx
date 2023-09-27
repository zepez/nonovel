import { cn } from "~/lib";

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
      className={cn("text-nn-accent mb-4 mt-12 flex items-center", className)}
    >
      <h3 className="mr-3 font-display text-lg">{children}</h3>
      <hr className="bg-nn-accent h-[1px] flex-grow border-none opacity-20" />
    </div>
  );
};
