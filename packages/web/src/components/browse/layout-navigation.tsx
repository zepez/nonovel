"use client";

import {
  useSearchParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "react-use";
import {
  AiFillStar,
  AiTwotoneEye,
  AiFillClockCircle,
  AiOutlineSearch,
} from "react-icons/ai";
import type { GetGenreManifestReturn } from "@nonovel/query";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { SelectGenre } from "~/components/browse/select-genre";

interface LayoutNavigationProps {
  genres: NonNullable<GetGenreManifestReturn[1]>;
}

export const LayoutNavigation = ({ genres }: LayoutNavigationProps) => {
  const router = useRouter();
  const currentGenre = useSelectedLayoutSegment() ?? "all";
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "popular";

  const [query, setQuery] = useState(q);
  const [sorting, setSorting] = useState(sort);
  const [genre, setGenre] = useState(currentGenre);

  const handleRoutingChange = useCallback(() => {
    const queries = new URLSearchParams({ q: query, sort: sorting });
    if (genre === "all") router.push(`/browse?${queries.toString()}`);
    else router.push(`/browse/${genre}?${queries.toString()}`);
  }, [genre, query, router, sorting]);

  // query change
  useDebounce(
    () => {
      if (query === q) return;

      handleRoutingChange();
    },
    500,
    [query, handleRoutingChange]
  );

  // sorting change
  useEffect(() => {
    if (sorting === sort) return;

    handleRoutingChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, handleRoutingChange]);

  // genre change
  useEffect(() => {
    if (genre === currentGenre) return;

    handleRoutingChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre, handleRoutingChange]);

  const handleClearFilters = () => {
    setQuery("");
    setSorting("popular");
    setGenre("all");
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
        <div className="nn-bg-contrast flex w-full items-center rounded-md">
          <AiOutlineSearch className="ml-4 mr-2 opacity-50" />
          <Input
            className="d border-none placeholder:text-nn-light/60 dark:placeholder:text-nn-dark/60"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <SelectGenre
          className="w-full sm:w-[250px]"
          value={genre}
          setValue={setGenre}
          genres={genres}
        />
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:mt-4 sm:flex-row">
        <div className="flex w-full items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="nn-bg-contrast w-full px-2 text-xs"
            disabled={sorting === "popular"}
            onClick={() => setSorting("popular")}
            title="Sort by popularity"
          >
            <AiTwotoneEye className="mr-2 hidden text-lg sm:inline" />{" "}
            Popularity
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="nn-bg-contrast w-full px-2 text-xs"
            disabled={sorting === "rating"}
            onClick={() => setSorting("rating")}
            title="Sort by average rating"
          >
            <AiFillStar className="mr-2 hidden text-lg sm:inline" /> Rating
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="nn-bg-contrast w-full px-2 text-xs"
            disabled={sorting === "recent"}
            onClick={() => setSorting("recent")}
            title="Sort by date added"
          >
            <AiFillClockCircle className="mr-2 hidden text-lg sm:inline" /> Date
            Added
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="nn-bg-contrast w-full flex-shrink-0 text-xs sm:w-auto"
          onClick={() => handleClearFilters()}
          title="Clear filters"
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
};
