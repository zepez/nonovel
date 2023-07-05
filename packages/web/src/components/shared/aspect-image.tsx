import Image from "next/image";

import { cn } from "~/lib/utils";

interface AspectImageProps {
  className?: string;
  src?: string | null;
  alt: string;
  width: number;
}

export const AspectImage = ({
  className,
  src,
  alt,
  width,
}: AspectImageProps) => {
  if (!src) return null;

  return (
    <div className={cn(className, "object-contain")}>
      <Image
        src={src}
        alt={alt}
        fill={false}
        width={width}
        height={width * 1.5}
        className="rounded-md"
      />
    </div>
  );
};
