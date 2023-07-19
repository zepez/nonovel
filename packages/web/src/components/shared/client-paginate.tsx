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
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="default"
        disabled={previousDisabled}
        className="nn-interactive text-xs"
        onClick={onPreviousClick}
      >
        <DoubleArrowLeftIcon className="mr-2" /> Previous
      </Button>
      <Button
        variant="default"
        disabled={nextDisabled}
        className="nn-interactive text-xs"
        onClick={onNextClick}
      >
        Next <DoubleArrowRightIcon className="ml-2" />
      </Button>
    </div>
  );
};
