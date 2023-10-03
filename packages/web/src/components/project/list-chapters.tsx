"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import type { GetChapterManifestByIdsReturn } from "@nonovel/query";
import { cn, toTitleCase } from "~/lib";
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
      className="nn-interactive flex items-center rounded-sm odd:bg-nn-secondary-light dark:odd:bg-nn-secondary-dark"
    >
      {isRead ? (
        <FaCheck className="mx-4 w-8 opacity-50" width={12} height={12} />
      ) : (
        <span className="mx-4 w-8"></span>
      )}

      <h3
        className={cn(
          height ? `py-${height}` : "py-3",
          isRead ? "opacity-50" : "opacity-100",
          "flex-grow pr-4"
        )}
      >
        {toTitleCase(name)}
      </h3>
      <span className="mx-4 text-xs opacity-30">#{symbol}</span>
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
      <div className="bg-nn-secondary flex h-32 items-center justify-center rounded-md">
        <p className="nn-detail">This book does not have any chapters.</p>
      </div>
    );

  return (
    <>
      {!disabledSearch && (
        <Input
          className="bg-nn-secondary mb-8 w-full"
          placeholder="Filter chapters"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <section className={cn(className, "grid grid-cols-1")}>
        {list.map((chapter) => (
          <ListItem
            key={chapter.id}
            href={`/read/${projectSlug}/chapter/${chapter.slug}`}
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
