"use client";

import * as React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { upsertVote } from "~/actions";
import { cn } from "~/lib";
import { Button } from "~/components/ui/button";

interface ReviewVoteProps {
  size: number;
  voteTotal: number;
  voteCurrent: number;
  userId: string | null;
  resourceId: string;
}

export const ReviewVote = ({
  size,
  voteCurrent,
  voteTotal,
  userId,
  resourceId,
}: ReviewVoteProps) => {
  const positive = voteCurrent > 0;
  const negative = voteCurrent < 0;

  const handleVote = async (direction: "up" | "down") => {
    if (!userId) return;

    await upsertVote({
      userId,
      resourceId,
      direction,
      voteCurrent,
      resourceType: "review",
      revalidate: window.location.pathname,
    });
  };

  return (
    <div
      className={cn(
        positive && "text-green-500",
        negative && "text-red-500",
        "flex flex-col sm:px-2"
      )}
    >
      <Button
        variant="ghost"
        className={cn(negative && "opacity-50", "m-0 p-0 pt-1")}
        onClick={() => handleVote("up")}
        disabled={!userId}
        title="Upvote review"
      >
        <ChevronUpIcon width={size} height={size} />
      </Button>
      <span className="py-1 text-center text-xs font-bold leading-tight">
        {voteTotal}
      </span>
      <Button
        variant="ghost"
        className={cn(positive && "opacity-50", "m-0 p-0 pb-1")}
        onClick={() => handleVote("down")}
        disabled={!userId}
        title="Downvote review"
      >
        <ChevronDownIcon width={size} height={size} />
      </Button>
    </div>
  );
};
