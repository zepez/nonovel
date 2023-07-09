"use client";

import { useTimeoutFn } from "react-use";
import { markViewed } from "~/actions/view";

interface ChapterViewProps {
  delay: number;
  userId?: string;
  projectId: string;
  chapterId: string;
}

export const ChapterView = ({
  delay,
  userId,
  projectId,
  chapterId,
}: ChapterViewProps) => {
  useTimeoutFn(() => {
    void markViewed({
      userId,
      projectId,
      chapterId,
      revalidate: window.location.pathname.split("/").slice(0, 3).join("/"),
    });
  }, delay);

  return <></>;
};
