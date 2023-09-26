import Image from "next/image";

import { src } from "~/lib/string";
import { cn } from "~/lib/utils";

interface AspectImageProps {
  className?: string;
  imgClassName?: string;
  src?: string | null;
  alt: string;
  width: number;
}

export const AspectImage = ({
  className,
  imgClassName,
  src: source,
  alt,
  width,
}: AspectImageProps) => {
  if (!source) return null;

  return (
    <div className={cn(className, "object-contain")}>
      <Image
        src={src(source)}
        alt={alt}
        fill={false}
        width={width}
        priority={true}
        height={width * 1.5}
        className={cn(imgClassName, "rounded-md")}
      />
    </div>
  );
};
