import Link from "next/link";
import { cn } from "~/lib/utils";

interface SectionEmptyProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
}

export const SectionEmpty = ({
  className,
  children,
  href,
}: SectionEmptyProps) => {
  const Tag = href ? Link : "section";

  return (
    <Tag
      href={href as string}
      className={cn(
        className,
        href && "nn-interactive",
        "nn-border nn-text-secondary block rounded-md border py-8 text-center"
      )}
    >
      {children}
    </Tag>
  );
};
