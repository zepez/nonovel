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
    <div className={cn(className, "flex items-center uppercase")}>
      <h3 className="mr-3 text-lg font-bold">{children}</h3>
      <hr className="nn-bg-contrast h-[1px] flex-grow border-none opacity-20" />
    </div>
  );
};
