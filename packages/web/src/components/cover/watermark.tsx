import { FullLogoLight } from "~/components/brand";
import { cn } from "~/lib/utils";

interface Props {
  className?: string;
}

export const Watermark = ({ className }: Props) => {
  return (
    <div className={cn(className, "flex w-full justify-center")}>
      <div className="rounded-sm p-2 backdrop-blur-lg backdrop-brightness-75">
        <FullLogoLight className="" />
      </div>
    </div>
  );
};
