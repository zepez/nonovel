import { cn } from "~/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Structure = ({ className, children }: Props) => {
  return (
    <div className={cn(className, "relative h-[900px] w-[600px]")}>
      {children}
    </div>
  );
};
