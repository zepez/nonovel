import { forwardRef } from "react";
import Balancer from "react-wrap-balancer";
import { cn, toTitleCase } from "~/lib";

interface Props {
  className?: string;
  title: string;
  author: string;
  children?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, Props>(
  ({ className, title, author, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-1/2 flex -translate-x-1/2 transform flex-col gap-4 bg-nn-base-light px-4 py-12 text-center text-nn-base-dark",
          className
        )}
      >
        <h1 className="font-display text-5xl font-bold italic leading-[1.1]">
          <Balancer>{toTitleCase(title)}</Balancer>
        </h1>
        <h2 className="m-0 font-display text-3xl">
          <Balancer>{toTitleCase(author)}</Balancer>
        </h2>

        {children}
      </div>
    );
  }
);
