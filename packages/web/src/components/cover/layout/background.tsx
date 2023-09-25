import { cn } from "~/lib/utils";

interface Props {
  className?: string;
  image: string;
}

export const Background = ({ className, image }: Props) => {
  return (
    <img
      src={`data:image/jpeg;base64,${image}`}
      className={cn(className, "absolute inset-0 h-full w-full object-cover")}
    />
  );
};
