"use client";

import Link from "next/link";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";

import type {
  GetChapterBySlugAndOrderReturn,
  GetChapterManifestByProjectIdReturn,
} from "@nonovel/query";
import { cn } from "~/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface DirectionalButtonProps {
  chapter: string | null;
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
      href={chapter ? `/p/${slug}/chapters/${parseInt(chapter)}` : "#"}
    >
      <div
        className={cn(
          className,
          chapter ? "nn-interactive" : "opacity-50",
          "nn-bg-background nn-border flex w-full items-center justify-center px-8 py-3 text-center"
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
  manifest: NonNullable<GetChapterManifestByProjectIdReturn[1]>;
}

const ChapterManifest = ({
  className,
  project,
  chapter,
  manifest,
}: ChapterNavigationProps) => {
  return (
    <Popover>
      <PopoverTrigger className={className}>
        <HamburgerMenuIcon width={22} height={22} className="mr-3" /> Table of
        Contents
      </PopoverTrigger>
      <PopoverContent className="text-xs nn-bg-background">
        <div className="flex flex-col divide-y nn-divide">
          {manifest.map((c) => (
            <Link
              key={c.id}
              href={`/p/${project.slug}/chapters/${parseInt(c.order)}`}
              className={cn(
                parseInt(chapter.order) == parseInt(c.order) &&
                  "nn-bg-foreground",
                "nn-interactive p-2"
              )}
            >
              Chapter {parseInt(c.order)} - {c.name.substring(0, 25)}...
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ########################################################

interface ChapterNavigationProps {
  project: NonNullable<GetChapterBySlugAndOrderReturn[1]>;
  chapter: NonNullable<GetChapterBySlugAndOrderReturn[1]>["chapters"][0];
  manifest: NonNullable<GetChapterManifestByProjectIdReturn[1]>;
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
      <nav className="grid grid-cols-1 gap-4 my-8 md:hidden">
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
      <nav className="flex-wrap items-center justify-between hidden my-8 md:flex">
        <DirectionalButton
          chapter={previousChapter}
          slug={project.slug}
          className="rounded-md"
          icon={<DoubleArrowLeftIcon width={22} height={22} />}
        />
        <div className="flex flex-wrap items-center justify-center">
          <ChapterManifest
            className="flex items-center justify-center px-4 py-3 text-xs font-bold leading-tight uppercase border-t border-b border-l nn-bg-background nn-border rounded-l-md"
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
