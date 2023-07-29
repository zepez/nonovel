"use client";

import Link from "next/link";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";

import type {
  GetChapterBySlugAndOrderReturn,
  GetChapterManifestByIdsReturn,
} from "@nonovel/query";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

interface DirectionalButtonProps {
  chapter: number | null;
  slug: string;
  icon: React.ReactNode;
  className?: string;
}

const DirectionalButton = ({
  chapter,
  slug,
  icon,
  className,
}: DirectionalButtonProps) => {
  return (
    <Link
      className={cn(!chapter && "nn-no-select", "rounded-md")}
      href={chapter ? `/p/${slug}/chapters/${chapter}` : "#"}
    >
      <div
        className={cn(
          className,
          chapter ? "nn-interactive" : "cursor-not-allowed opacity-50",
          "nn-bg-background nn-border flex w-full items-center justify-center border px-8 py-3 text-center"
        )}
      >
        {icon}
      </div>
    </Link>
  );
};

// ########################################################

interface ChapterNavigationProps {
  className?: string;
  project: NonNullable<GetChapterBySlugAndOrderReturn[1]>;
  chapter: NonNullable<GetChapterBySlugAndOrderReturn[1]>["chapters"][0];
  manifest: NonNullable<GetChapterManifestByIdsReturn[1]>;
}

const ChapterManifest = ({
  className,
  project,
  chapter,
  manifest,
}: ChapterNavigationProps) => {
  return (
    <Popover>
      <PopoverTrigger className={cn(className, "nn-interactive")}>
        <HamburgerMenuIcon width={22} height={22} className="mr-3" /> Table of
        Contents
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="nn-bg-background w-screen text-xs sm:w-[300px]"
      >
        <ScrollArea className="h-[300px] rounded-md">
          <div className="nn-divide flex min-h-[300px] flex-col divide-y">
            {manifest.map((c) => (
              <Link
                key={c.id}
                href={`/p/${project.slug}/chapters/${c.order}`}
                className={cn(
                  chapter.order == c.order && "nn-bg-foreground",
                  "nn-interactive flex items-center justify-center px-2 py-4"
                )}
              >
                <span className="flex-grow">{c.name} </span>
                <span className="mx-2 text-xs opacity-30">#{c.order}</span>
              </Link>
            ))}
            <div className="flex-grow" />
            <Link
              className="flex items-center justify-center p-2 px-4 mx-2 mt-4 mb-2 text-xs font-bold leading-tight uppercase rounded-md nn-bg-contrast nn-interactive"
              href={`/p/${project.slug}/chapters`}
            >
              View all
            </Link>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

// ########################################################

interface ChapterNavigationProps {
  project: NonNullable<GetChapterBySlugAndOrderReturn[1]>;
  chapter: NonNullable<GetChapterBySlugAndOrderReturn[1]>["chapters"][0];
  manifest: NonNullable<GetChapterManifestByIdsReturn[1]>;
}

export const ChapterNavigation = ({
  project,
  chapter,
  manifest,
}: ChapterNavigationProps) => {
  const chapterIndex = manifest.findIndex((c) => c.id === chapter.id) ?? 1;
  const previousChapter = manifest[chapterIndex - 1]?.order ?? null;
  const nextChapter = manifest[chapterIndex + 1]?.order ?? null;

  return (
    <>
      {/* mobile */}
      <nav className="grid grid-cols-1 gap-4 md:hidden">
        <div className="grid grid-cols-2">
          <DirectionalButton
            chapter={previousChapter}
            slug={project.slug}
            className="rounded-l-md"
            icon={<DoubleArrowLeftIcon width={22} height={22} />}
          />
          <DirectionalButton
            chapter={nextChapter}
            slug={project.slug}
            className="rounded-r-md"
            icon={<DoubleArrowRightIcon width={22} height={22} />}
          />
        </div>

        <ChapterManifest
          className="flex items-center justify-center px-4 py-3 text-xs font-bold leading-tight uppercase rounded-md nn-bg-background nn-border"
          project={project}
          manifest={manifest}
          chapter={chapter}
        />
      </nav>

      {/* desktop */}
      <nav className="flex-wrap items-center justify-between hidden md:flex">
        <DirectionalButton
          chapter={previousChapter}
          slug={project.slug}
          className="rounded-md"
          icon={<DoubleArrowLeftIcon width={22} height={22} />}
        />
        <div className="flex flex-wrap items-center justify-center">
          <ChapterManifest
            className="flex items-center justify-center px-4 py-3 text-xs font-bold leading-tight uppercase border border-t border-b border-l nn-bg-background nn-border rounded-l-md"
            project={project}
            manifest={manifest}
            chapter={chapter}
          />
          <DirectionalButton
            chapter={nextChapter}
            slug={project.slug}
            className="rounded-r-md"
            icon={<DoubleArrowRightIcon width={22} height={22} />}
          />
        </div>
      </nav>
    </>
  );
};
