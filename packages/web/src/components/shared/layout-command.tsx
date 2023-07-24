"use client";

import { useEffect, useState, type SetStateAction, type Dispatch } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "react-use";
import { useSession } from "next-auth/react";
import {
  MoonIcon,
  SunIcon,
  GearIcon,
  ThickArrowRightIcon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
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
import { Logout, LoginDialog } from "~/components/auth";
import { ThemeSwitcher } from "~/components/shared/theme-switcher";
import { toTitleCase } from "~/lib/string";

interface LayoutCommandProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const LayoutCommand = ({ open, setOpen }: LayoutCommandProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    NonNullable<GetOmniSearchResultReturn[1]>
  >([]);

  const minQueryLength = 3;
  const iconClass = "mr-2 py-[2px]";

  const authedSuggestions = [
    {
      name: "Settings",
      value: "settings/account",
      action: (v: string) => router.push(v),
      icon: <GearIcon className={iconClass} />,
    },
  ];

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

      if (query.length >= minQueryLength) {
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

    if (q.length >= minQueryLength) {
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
    callback();
    setOpen(false);
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
        {/* loading */}
        {loading && (
          <CommandLoading>
            <p className="nn-text-secondary nn-border-bottom block p-4 text-center">
              Searching for projects...
            </p>
          </CommandLoading>
        )}

        {/* no result */}
        {!loading && query.length >= minQueryLength && result.length === 0 && (
          <p className="nn-text-secondary nn-border-bottom block p-4 text-center">
            No projects found with query {query}.
          </p>
        )}

        {/* project results */}
        {result.length > 0 && (
          <CommandGroup heading="Projects">
            {result.map((r) => (
              <CommandItem
                key={`${r.type}/${r.slug}/${r.name}`}
                value={`${r.type}/${r.slug}/${r.name}`}
                onSelect={() => handleSelect(() => router.push(`/p/${r.slug}`))}
              >
                {toTitleCase(r.name)}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />
        <CommandGroup heading="Suggestions">
          <ThemeSwitcher
            className="p-0"
            darkChildren={(cb) => (
              <CommandItem
                key="suggestions/theme/dark"
                value="suggestions/theme/dark"
                onSelect={cb}
              >
                <MoonIcon className={iconClass} /> Dark Theme
              </CommandItem>
            )}
            lightChildren={(cb) => (
              <CommandItem
                key="suggestions/theme/light"
                value="suggestions/theme/light"
                onSelect={cb}
              >
                <SunIcon className={iconClass} /> Light Theme
              </CommandItem>
            )}
          />
          {session ? (
            <>
              {authedSuggestions.map((s) => (
                <CommandItem
                  key={`suggestions/${s.value}/${s.name}`}
                  value={`suggestions/${s.value}/${s.name}`}
                  onSelect={() => handleSelect(() => s.action(s.value))}
                >
                  {s.icon} {s.name}
                </CommandItem>
              ))}
              <Logout className="flex w-full items-center text-left">
                {(cb) => (
                  <CommandItem
                    key="suggestions/logout"
                    value="suggestions/logout"
                    onSelect={() => cb()}
                    className="w-full p-0"
                  >
                    <ThickArrowRightIcon className={iconClass} /> Logout
                  </CommandItem>
                )}
              </Logout>
            </>
          ) : (
            <LoginDialog>
              {(cb) => (
                <CommandItem
                  key="suggestions/login"
                  value="suggestions/login"
                  onSelect={cb}
                  className="w-full p-0"
                >
                  <LockClosedIcon className={iconClass} /> Login
                </CommandItem>
              )}
            </LoginDialog>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
