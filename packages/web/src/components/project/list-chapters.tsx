"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { GetProjectBySlugReturn } from "@nonovel/query";

import { cn } from "~/lib/utils";
import { toTitleCase } from "~/lib/string";
import { Input } from "~/components/ui/input";

interface ListItemProps {
  href: string;
  name: string;
  symbol: string;
  height?: string | number;
}

const ListItem = ({ href, name, symbol, height }: ListItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center nn-interactive odd:bg-white dark:odd:bg-zinc-900"
    >
      <div className="flex-shrink-0 w-auto mx-8 font-bold text-center md:w-24">
        {symbol}
      </div>{" "}
      <h3 className={cn(height ? `py-${height}` : "py-3", "pr-4")}>
        {toTitleCase(name)}
      </h3>
    </Link>
  );
};

interface ListChaptersProps {
  className?: string;
  chapters: NonNullable<GetProjectBySlugReturn[1]>["chapters"];
  projectSlug: string;
  disabledSearch?: boolean;
  itemHeight?: string | number;
  additionalItems?: AdditionItemProps[];
}

interface AdditionItemProps {
  href: string;
  name: string;
  symbol: string;
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
        searchRegex.test(chapter.name) || searchRegex.test(chapter.order)
    );

    setList(filteredChapters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (!chapters.length)
    return (
      <div className="flex items-center justify-center h-32 rounded-md nn-bg-background">
        <p className="nn-text-secondary">
          This novel does not have any chapters.
        </p>
      </div>
    );

  return (
    <>
      {!disabledSearch && (
        <Input
          className="w-full mb-8"
          placeholder="Filter chapters"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <section className={cn(className, "grid grid-cols-1")}>
        {list.map((chapter, chapterIdx) => (
          <ListItem
            key={chapterIdx}
            href={`/p/${projectSlug}/chapters/${chapter.order}`}
            name={chapter.name}
            symbol={chapter.order}
            height={itemHeight}
          />
        ))}
        {additionalItems.map((item, itemIdx) => (
          <ListItem
            key={itemIdx}
            href={item.href}
            name={item.name}
            symbol={item.symbol}
            height={itemHeight}
          />
        ))}
      </section>
    </>
  );
};
