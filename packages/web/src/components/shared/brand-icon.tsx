import { cn } from "~/lib/utils";

interface BrandIconProps {
  className?: string;
}

export const BrandIcon = ({ className }: BrandIconProps) => {
  return <i className={cn("text-4xl", className)}>📖</i>;
};
