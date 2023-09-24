import { cn } from "~/lib/utils";

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutWrapper = ({ children, className }: LayoutWrapperProps) => {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-8 pt-12 sm:px-12", className)}
    >
      {children}
    </div>
  );
};
