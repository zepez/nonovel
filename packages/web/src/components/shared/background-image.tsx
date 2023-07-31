import { cn } from "~/lib/utils";

interface BackgroundImageProps {
  children?: React.ReactNode;
  className?: string;
  src: string | null;
}

export const BackgroundImage = ({
  src,
  children,
  className,
}: BackgroundImageProps) => {
  return (
    <div className="relative overflow-hidden">
      <div
        className="nn-bg-blurred-2 absolute inset-0 z-0 bg-cover"
        style={
          src
            ? {
                backgroundImage: `url(${src})`,
              }
            : {}
        }
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
