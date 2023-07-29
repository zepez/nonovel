"use client";

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
}

export const ClientPaginate = ({
  onPreviousClick,
  previousDisabled,
  onNextClick,
  nextDisabled,
}: ClientPaginateProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        variant="default"
        disabled={previousDisabled}
        className="text-xs nn-interactive"
        onClick={onPreviousClick}
        title="Previous page"
      >
        <DoubleArrowLeftIcon className="mr-2" /> Previous
      </Button>
      <Button
        variant="default"
        disabled={nextDisabled}
        className="text-xs nn-interactive"
        onClick={onNextClick}
        title="Next page"
      >
        Next <DoubleArrowRightIcon className="ml-2" />
      </Button>
    </div>
  );
};
