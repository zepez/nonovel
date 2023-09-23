import { cn } from "~/lib/utils";

interface BackgroundImageProps {
  children?: React.ReactNode;
  className?: string;
  src: string | null;
  tiled?: boolean;
}

export const BackgroundImage = ({
  src,
  children,
  className,
  tiled = false,
}: BackgroundImageProps) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "nn-bg-blurred absolute inset-0 z-0",
          tiled ? "bg-repeat" : "bg-cover"
        )}
        style={
          src
            ? {
                backgroundImage: `linear-gradient(0deg, var(--nn-fade) 20%, transparent), url(${src})`,
                backgroundPosition: "center top",
              }
            : {}
        }
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
