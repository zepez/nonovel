"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";
import { AspectImage } from "../aspect-image";

interface CommentBodyProps {
  className?: string;
  username: string;
  image: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentBody = (props: CommentBodyProps) => {
  const createdAt = formatDistanceToNow(new Date(props.createdAt), {
    addSuffix: true,
  });
  const updatedAt = formatDistanceToNow(new Date(props.updatedAt), {
    addSuffix: true,
  });
  return (
    <div className={cn(props.className, "flex gap-4")}>
      <AspectImage
        src={props.image}
        width={35}
        alt={`${props.username} profile image`}
      />
      <div>
        <p className="mb-1 text-sm font-bold leading-tight">
          @{props.username}
        </p>
        <p className="nn-text-secondary text-xs">Posted {createdAt}</p>

        {createdAt !== updatedAt && (
          <p className="nn-text-secondary text-xs">Updated {updatedAt}</p>
        )}

        <p className="mt-3 whitespace-pre-wrap text-sm">{props.content}</p>
      </div>
    </div>
  );
};
