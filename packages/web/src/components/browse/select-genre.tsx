"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import type { GetGenreManifestReturn } from "@nonovel/query";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface SelectGenreProps {
  value: string;
  setValue: (value: string) => void;
  genres: NonNullable<GetGenreManifestReturn[1]>;
  className?: string;
}

export const SelectGenre = ({
  value,
  setValue,
  genres,
  className,
}: SelectGenreProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          size="sm"
          aria-expanded={open}
          className={cn(className, "justify-between bg-nn-light text-nn-dark")}
          title="Select a genre"
        >
          {value
            ? genres.find((genre) => genre.slug === value)?.name ?? "All Genres"
            : "Select Genre..."}
          <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] bg-nn-light p-0 text-nn-dark">
        <Command>
          <CommandInput placeholder="Search genre..." className="h-9" />
          <CommandEmpty>No genre found.</CommandEmpty>
          <CommandGroup className="text-nn-dark bg-nn-light">
            <ScrollArea className="h-[250px] rounded-md">
              {genres.map((genre) => (
                <CommandItem
                  key={genre.slug}
                  onSelect={(currentValue) => {
                    const slug =
                      genres.find(
                        (genre) => genre.name.toLowerCase() === currentValue
                      )?.slug ?? "all";
                    setValue(slug === value ? "all" : slug);
                    setOpen(false);
                  }}
                >
                  {genre.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === genre.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
