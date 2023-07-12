"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { GetChapterManifestByIdsReturn } from "@nonovel/query";

import { cn } from "~/lib/utils";
import { toTitleCase } from "~/lib/string";
import { Input } from "~/components/ui/input";

interface ListItemProps {
  href: string;
  name: string;
  symbol: string | number;
  height?: string | number;
  isRead?: boolean;
}

const ListItem = ({ href, name, symbol, height, isRead }: ListItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        isRead ? "opacity-50" : "",
        "nn-interactive flex items-center odd:bg-white dark:odd:bg-zinc-900"
      )}
    >
      <div className="mx-8 flex w-12 flex-shrink-0 font-bold sm:w-14">
        <div className="mr-2 w-4 flex-shrink-0">{isRead && "✔"}</div>
        <span className="">{symbol}</span>
      </div>
      <h3 className={cn(height ? `py-${height}` : "py-3", "flex-grow pr-4")}>
        {toTitleCase(name)}
      </h3>
    </Link>
  );
};

interface ListChaptersProps {
  className?: string;
  chapters: NonNullable<GetChapterManifestByIdsReturn[1]>;
  projectSlug: string;
  disabledSearch?: boolean;
  itemHeight?: string | number;
  additionalItems?: {
    href: string;
    name: string;
    symbol: string;
  }[];
}

export const ListChapters = ({
  className,
  chapters,
  projectSlug,
  disabledSearch,
  itemHeight,
  additionalItems = [],
}: ListChaptersProps) => {
  const [list, setList] = useState(chapters);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchRegex = new RegExp(search, "i");
    const filteredChapters = chapters.filter(
      (chapter) =>
        searchRegex.test(chapter.name) ||
        searchRegex.test(chapter.order.toString())
    );

    setList(filteredChapters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (!chapters.length)
    return (
      <div className="nn-bg-background flex h-32 items-center justify-center rounded-md">
        <p className="nn-text-secondary">
          This novel does not have any chapters.
        </p>
      </div>
    );

  return (
    <>
      {!disabledSearch && (
        <Input
          className="nn-bg-background mb-8 w-full"
          placeholder="Filter chapters"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <section className={cn(className, "grid grid-cols-1")}>
        {list.map((chapter) => (
          <ListItem
            key={chapter.id}
            href={`/p/${projectSlug}/chapters/${chapter.order}`}
            name={chapter.name}
            symbol={chapter.order}
            height={itemHeight}
            isRead={chapter.userChapterViews.length > 0}
          />
        ))}
        {additionalItems.map((item, itemIdx) => (
          <span key={itemIdx} className="opacity-50">
            <ListItem
              href={item.href}
              name={item.name}
              symbol={item.symbol}
              height={itemHeight}
            />
          </span>
        ))}
      </section>
    </>
  );
};
