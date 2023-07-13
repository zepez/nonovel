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
      <PopoverContent align="end" className="nn-bg-background text-xs">
        <ScrollArea className="h-[250px] rounded-md">
          <div className="nn-divide flex min-h-[250px] flex-col divide-y">
            {manifest.map((c) => (
              <Link
                key={c.id}
                href={`/p/${project.slug}/chapters/${c.order}`}
                className={cn(
                  chapter.order == c.order && "nn-bg-foreground",
                  "nn-interactive p-2"
                )}
              >
                Chapter {c.order} - {c.name.substring(0, 25)}...
              </Link>
            ))}
            <div className="flex-grow" />
            <Link
              className="nn-bg-contrast nn-interactive mx-2 mb-2 mt-4 flex items-center justify-center rounded-md p-2 px-4 text-xs font-bold uppercase leading-tight"
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
          className="nn-bg-background nn-border flex items-center justify-center rounded-md px-4 py-3 text-xs font-bold uppercase leading-tight"
          project={project}
          manifest={manifest}
          chapter={chapter}
        />
      </nav>

      {/* desktop */}
      <nav className="hidden flex-wrap items-center justify-between md:flex">
        <DirectionalButton
          chapter={previousChapter}
          slug={project.slug}
          className="rounded-md"
          icon={<DoubleArrowLeftIcon width={22} height={22} />}
        />
        <div className="flex flex-wrap items-center justify-center">
          <ChapterManifest
            className="nn-bg-background nn-border flex items-center justify-center rounded-l-md border border-b border-l border-t px-4 py-3 text-xs font-bold uppercase leading-tight"
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
