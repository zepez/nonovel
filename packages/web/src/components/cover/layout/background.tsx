import { cn } from "~/lib";

interface Props {
  className?: string;
  image: string;
}

export const Background = ({ className, image }: Props) => {
  return (
    <img
      src={`data:image/jpeg;base64,${image}`}
      id="background"
      className={cn(className, "absolute inset-0 h-full w-full object-cover")}
    />
  );
};
