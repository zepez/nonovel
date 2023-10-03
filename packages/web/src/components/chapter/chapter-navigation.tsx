"use client";

import Link from "next/link";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";

import type {
  GetChapterBySlugsReturn,
  GetChapterManifestByIdsReturn,
} from "@nonovel/query";
import { cn, toTitleCase } from "~/lib";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ChapterSettings } from "~/components/chapter/chapter-settings";

interface DirectionalButtonProps {
  chapter: string | null;
  slug: string;
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const DirectionalButton = ({
  chapter,
  slug,
  title,
  icon,
  className,
}: DirectionalButtonProps) => {
  return (
    <Link
      className={cn(!chapter && "nn-no-select", "rounded-md")}
      href={chapter ? `/read/${slug}/chapter/${chapter}` : "#"}
      aria-disabled={!chapter}
      title={title}
    >
      <div
        className={cn(
          className,
          chapter ? "nn-interactive" : "cursor-not-allowed opacity-50",
          "bg-nn-secondary flex w-full items-center justify-center px-8 py-3 text-center"
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
  project: NonNullable<GetChapterBySlugsReturn[1]>;
  chapter: NonNullable<GetChapterBySlugsReturn[1]>["chapters"][0];
  manifest: NonNullable<GetChapterManifestByIdsReturn[1]>;
}

const ChapterManifest = ({
  className,
  project,
  chapter,
  manifest,
}: ChapterNavigationProps) => {
  return (
    <Dialog>
      <DialogTrigger className={cn(className, "nn-interactive")}>
        <HamburgerMenuIcon width={22} height={22} className="mr-3" /> Table of
        Contents
      </DialogTrigger>
      <DialogContent className="bg-nn-base w-screen text-xs sm:w-[400px]">
        <ScrollArea className="h-[400px] rounded-md">
          <div className="nn-divide m-2 flex min-h-[400px] flex-col divide-y">
            {manifest.map((c) => (
              <Link
                key={c.id}
                href={`/read/${project.slug}/chapter/${c.slug}`}
                className={cn(
                  chapter.order == c.order && "bg-nn-secondary",
                  "nn-interactive grid grid-cols-6 items-center px-2 py-4"
                )}
              >
                <span className="col-span-5 inline-block truncate">
                  {toTitleCase(c.name)}
                </span>
                <span className="mx-2 inline justify-self-end text-xs opacity-30">
                  #{c.order}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// ########################################################

interface ChapterNavigationProps {
  project: NonNullable<GetChapterBySlugsReturn[1]>;
  chapter: NonNullable<GetChapterBySlugsReturn[1]>["chapters"][0];
  manifest: NonNullable<GetChapterManifestByIdsReturn[1]>;
}

export const ChapterNavigation = ({
  project,
  chapter,
  manifest,
}: ChapterNavigationProps) => {
  const chapterIndex = manifest.findIndex((c) => c.id === chapter.id) ?? 1;
  const previousChapter = manifest[chapterIndex - 1]?.slug ?? null;
  const nextChapter = manifest[chapterIndex + 1]?.slug ?? null;

  return (
    <>
      {/* mobile */}
      <nav className="grid grid-cols-1 gap-4 md:hidden">
        <div className="grid grid-cols-2">
          <DirectionalButton
            chapter={previousChapter}
            slug={project.slug}
            className="nn-border rounded-l-md border-r"
            title="Previous chapter"
            icon={<DoubleArrowLeftIcon width={22} height={22} />}
          />
          <DirectionalButton
            chapter={nextChapter}
            slug={project.slug}
            className="rounded-r-md"
            title="Next chapter"
            icon={<DoubleArrowRightIcon width={22} height={22} />}
          />
        </div>

        <ChapterSettings
          triggerText="Settings"
          className="nn-interactive bg-nn-secondary flex items-center justify-center gap-3 rounded-md px-8 py-3 text-xs font-bold uppercase leading-tight"
        />
        <ChapterManifest
          className="bg-nn-secondary flex items-center justify-center rounded-md px-4 py-3 text-xs font-bold uppercase leading-tight"
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
          title="Previous chapter"
          className="rounded-md"
          icon={<DoubleArrowLeftIcon width={22} height={22} />}
        />
        <div className="flex flex-wrap items-center justify-center">
          <ChapterSettings className="nn-interactive bg-nn-secondary rounded-l-md px-8 py-3 text-center" />
          <ChapterManifest
            className="bg-nn-secondary nn-border flex items-center justify-center border-l border-r px-4 py-3 text-xs font-bold uppercase leading-tight"
            project={project}
            manifest={manifest}
            chapter={chapter}
          />
          <DirectionalButton
            chapter={nextChapter}
            slug={project.slug}
            title="Next chapter"
            className="rounded-r-md"
            icon={<DoubleArrowRightIcon width={22} height={22} />}
          />
        </div>
      </nav>
    </>
  );
};
