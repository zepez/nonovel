"use client";

import { useRouter } from "next/navigation";

import { ClientPaginate } from "../shared";

interface LayoutPaginateProps {
  className?: string;
  currentPage: number;
  previousDisabled: boolean;
  nextDisabled: boolean;
}

export const LayoutPaginate = ({
  currentPage = 1,
  previousDisabled = false,
  nextDisabled = false,
}: LayoutPaginateProps) => {
  const router = useRouter();

  return (
    <ClientPaginate
      onNextClick={() => router.push(`${currentPage + 1}`)}
      previousDisabled={previousDisabled}
      onPreviousClick={() => router.push(`${currentPage - 1}`)}
      nextDisabled={nextDisabled}
    />
  );
};
