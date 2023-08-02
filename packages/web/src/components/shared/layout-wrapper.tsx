import { cn } from "~/lib/utils";

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutWrapper = ({ children, className }: LayoutWrapperProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-5xl px-6 pb-16 pt-12 md:px-16 lg:px-16",
        className
      )}
    >
      {children}
    </div>
  );
};
