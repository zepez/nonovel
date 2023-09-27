"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import {
  Pencil1Icon,
  Cross1Icon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

import type { GetCommentPageByResourceIdReturn } from "@nonovel/query";
import { upsertVote } from "~/actions";
import { cn, src } from "~/lib";
import { Button } from "~/components/ui/button";
import { AspectImage } from "../aspect-image";
import { CommentEdit } from "./edit";

interface CommentNavButtonProps {
  onClick?: () => void;
  className?: string;
  size?: number;
  Icon: typeof Pencil1Icon | typeof FiThumbsUp;
  disabled?: boolean;
  text?: string;
  title: string;
}

const CommentNavButton = ({
  onClick,
  className,
  Icon,
  size = 20,
  disabled = false,
  text,
  title,
}: CommentNavButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="fluid"
      onClick={onClick}
      disabled={disabled}
      className={cn("px-2", className)}
      title={title}
    >
      <Icon width={size} height={size} />
      {text && <span className="nn-detail ml-2">{text}</span>}
    </Button>
  );
};

type Comments = NonNullable<GetCommentPageByResourceIdReturn[1]>;

interface CommentBodyProps {
  refresh: () => void;
  className?: string;
  user: {
    userId: string;
    username: string;
    image: string | null;
  };
  comment: Comments[0];
}

export const CommentBody = ({
  refresh,
  className,
  user,
  comment,
}: CommentBodyProps) => {
  const { data: session } = useSession();

  const isCreator = user.userId === session?.user.id;
  const [isEditing, setIsEditing] = useState(false);

  const createdAt = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });
  const updatedAt = formatDistanceToNow(new Date(comment.updatedAt), {
    addSuffix: true,
  });

  const handleVote = async (direction: "up" | "down") => {
    if (!session?.user.id) return;

    await upsertVote({
      userId: session?.user.id,
      resourceId: comment.id,
      direction,
      voteCurrent: comment.voteCurrent,
      resourceType: "comment",
      revalidate: window.location.pathname,
    });

    refresh();
  };

  return (
    <div className={cn(className)}>
      {/* meat of the comment */}
      <div className="flex gap-4">
        <AspectImage
          src={src(user.image, "profile")}
          width={35}
          alt={`${user.username} profile image`}
        />
        <div className="flex-grow">
          <p className="mb-1 text-sm font-bold leading-tight">
            @{user.username}
          </p>
          <p className="nn-detail text-xs">{createdAt}</p>
        </div>
      </div>

      {/* editing */}
      {isEditing ? (
        <CommentEdit
          refresh={() => {
            setIsEditing(false);
            refresh();
          }}
          deleteFn={() => null}
          comment={{ ...comment, userId: user.userId }}
          background={comment.parentId ? "bg-nn-secondary" : "bg-nn-base"}
          className="mb-4"
          defaultSubmitText="Update Comment"
          actionText={["Updating", "Updated"]}
        />
      ) : (
        <>
          {createdAt !== updatedAt && (
            <span className="nn-detail nn-border mt-2 inline-block rounded-sm border px-1 text-xs">
              *edited {updatedAt}
            </span>
          )}
          <p className="text-md my-4 whitespace-pre-wrap">{comment.content}</p>
        </>
      )}

      {/* comment actions */}
      <div className="flex">
        <div className="flex items-center">
          <CommentNavButton
            Icon={FiThumbsUp}
            disabled={!session?.user.id || user.username === "deleted"}
            onClick={async () => await handleVote("up")}
            className={cn(comment.voteCurrent > 0 && "bg-green-500/20")}
            title="Like comment"
          />
          <CommentNavButton
            Icon={FiThumbsDown}
            disabled={!session?.user.id || user.username === "deleted"}
            onClick={async () => await handleVote("down")}
            className={cn(comment.voteCurrent < 0 && "bg-red-500/20")}
            title="Dislike comment"
          />
          <span className="nn-detail mx-2 text-center">
            {comment.voteTotal} like
            {comment.voteTotal.toString() !== "1" &&
              comment.voteTotal.toString() !== "-1" &&
              "s"}
          </span>
        </div>
        <div className="nn-border ml-2 border-l-2 pl-2">
          {isCreator ? (
            <>
              {isEditing ? (
                <CommentNavButton
                  Icon={Cross1Icon}
                  onClick={() => setIsEditing(false)}
                  title="Cancel editing"
                />
              ) : (
                <CommentNavButton
                  Icon={Pencil1Icon}
                  onClick={() => setIsEditing(true)}
                  title="Edit comment"
                />
              )}
            </>
          ) : (
            <CommentNavButton
              Icon={ExclamationTriangleIcon}
              disabled={!session?.user.id || user.username === "deleted"}
              title="Report comment"
            />
          )}
        </div>
      </div>
    </div>
  );
};
