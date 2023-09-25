import Balancer from "react-wrap-balancer";
import { cn } from "~/lib/utils";

interface Props {
  className?: string;
  title: string;
  author: string;
  children?: React.ReactNode;
}

export const Card = ({ className, title, author, children }: Props) => {
  return (
    <div
      className={cn(
        className,
        "absolute left-1/2 -translate-x-1/2 transform bg-nn-base-light px-4 py-8 text-center text-nn-base-dark"
      )}
    >
      <h1 className="mb-4 font-display text-5xl font-bold italic leading-snug">
        <Balancer>{title}</Balancer>
      </h1>
      <h2 className="m-0 font-display text-3xl">
        <Balancer>{author}</Balancer>
      </h2>

      {children}
    </div>
  );
};
