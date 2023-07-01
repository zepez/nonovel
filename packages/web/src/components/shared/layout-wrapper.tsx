import { cn } from "~/lib/utils";

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const LayoutWrapper = ({ children, className }: LayoutWrapperProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};
