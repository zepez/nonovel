import { cn } from "~/lib/utils";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};
