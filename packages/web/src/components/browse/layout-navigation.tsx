"use client";

import {
  useSearchParams,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "react-use";
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
  }, [sorting, handleRoutingChange]);

  // genre change
  useEffect(() => {
    if (genre === currentGenre) return;

    handleRoutingChange();
  }, [genre, handleRoutingChange]);

  const handleClearFilters = () => {
    setQuery("");
    setSorting("popular");
    setGenre("all");
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
        <Input
          className="border-none bg-white text-black"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SelectGenre
          className="w-full sm:w-[250px]"
          value={genre}
          setValue={setGenre}
          genres={genres}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white text-xs text-black"
            disabled={sorting === "popular"}
            onClick={() => setSorting("popular")}
          >
            Popular
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white text-xs text-black"
            disabled={sorting === "recent"}
            onClick={() => setSorting("recent")}
          >
            Recently Added
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="bg-white text-xs text-black"
          onClick={() => handleClearFilters()}
        >
          Clear Filters
        </Button>
      </div>
    </>
  );
};
