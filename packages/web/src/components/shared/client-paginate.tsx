"use client";

import { cn } from "~/lib";
import {
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

interface ClientPaginateProps {
  onPreviousClick: () => void;
  previousDisabled: boolean;
  onNextClick: () => void;
  nextDisabled: boolean;
  className?: string;
}

export const ClientPaginate = ({
  onPreviousClick,
  previousDisabled,
  onNextClick,
  nextDisabled,
  className,
}: ClientPaginateProps) => {
  return (
    <div
      className={cn("mt-8 flex items-center justify-center gap-4", className)}
    >
      <Button
        variant="default"
        disabled={previousDisabled}
        className="nn-interactive text-xs"
        onClick={onPreviousClick}
        title="Previous page"
      >
        <DoubleArrowLeftIcon className="mr-2" /> Previous
      </Button>
      <Button
        variant="default"
        disabled={nextDisabled}
        className="nn-interactive text-xs"
        onClick={onNextClick}
        title="Next page"
      >
        Next <DoubleArrowRightIcon className="ml-2" />
      </Button>
    </div>
  );
};
