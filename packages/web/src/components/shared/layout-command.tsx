"use client";

import { useEffect, useState, type SetStateAction, type Dispatch } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "react-use";
import type { GetOmniSearchResultReturn } from "@nonovel/query";
import { getSearch } from "~/actions";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandLoading,
  CommandSeparator,
} from "~/components/ui/command";

const suggestions = (router: ReturnType<typeof useRouter>) => [
  {
    name: "Settings",
    value: "/settings/account",
    action: (v: string) => router.push(v),
  },
  {
    name: "Logout",
    value: "/api/auth/signout",
    action: (v: string) => router.push(v),
  },
];

interface LayoutCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const LayoutCommand = ({ open, setOpen }: LayoutCommandProps) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    NonNullable<GetOmniSearchResultReturn[1]>
  >([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  useDebounce(
    async () => {
      if (!open) return;

      if (query.length > 2) {
        const [, r] = await getSearch({ query });
        if (r) setResult(r);
      }

      setLoading(false);
    },
    500,
    [query]
  );

  const handleValueChange = (q: string) => {
    setQuery(q);

    if (q.length > 2) {
      setLoading(true);
      setResult([]);
    }
  };

  const handleCustomFilter = (value: string, search: string): number => {
    value = value.toLowerCase().replace(/[\s-]/g, "");
    search = search.toLowerCase().replace(/[\s-]/g, "");

    if (value.includes(search)) return 1;

    return 0;
  };

  const handleSelect = (callback: () => void) => {
    setOpen(false);
    callback();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      filter={handleCustomFilter}
    >
      <CommandInput
        value={query}
        onValueChange={handleValueChange}
        placeholder="Search for projects or actions"
      />
      <CommandList>
        {/* no query */}
        {!loading && !query && result.length === 0 && (
          <p className="nn-text-secondary nn-border block p-4 text-center">
            Search something!
          </p>
        )}

        {/* loading */}
        {loading && (
          <CommandLoading>
            <p className="nn-text-secondary nn-border block p-4 text-center">
              Searching...
            </p>
          </CommandLoading>
        )}

        {/* no result */}
        {!loading && query && result.length === 0 && (
          <p className="nn-text-secondary nn-border block p-4 text-center">
            No projects found with query {query}.
          </p>
        )}

        {/* project results */}
        <CommandGroup heading="Projects">
          {result.map((r) => (
            <CommandItem
              key={`${r.type}/${r.slug}/${r.name}`}
              value={`${r.type}/${r.slug}/${r.name}`}
              onSelect={() => handleSelect(() => router.push(`/p/${r.slug}`))}
            >
              {r.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Suggestions">
          {suggestions(router).map((s) => (
            <CommandItem
              key={`suggestions/${s.value}/${s.name}`}
              value={`suggestions/${s.value}/${s.name}`}
              onSelect={() => handleSelect(() => s.action(s.value))}
            >
              {s.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
