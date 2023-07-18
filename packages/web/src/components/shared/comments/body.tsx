"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import {
  Pencil1Icon,
  Cross1Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import type { GetCommentPageByResourceIdReturn } from "@nonovel/query";
import { upsertVote } from "~/actions";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { AspectImage } from "../aspect-image";
import { CommentEdit } from "./edit";

interface CommentNavButtonProps {
  onClick?: () => void;
  className?: string;
  size?: number;
  Icon: typeof Pencil1Icon;
  disabled?: boolean;
}

const CommentNavButton = ({
  onClick,
  className,
  Icon,
  size = 20,
  disabled = false,
}: CommentNavButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="fluid"
      onClick={onClick}
      disabled={disabled}
      className={cn("px-2", className)}
    >
      <Icon width={size} height={size} />
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

export const CommentBody = (props: CommentBodyProps) => {
  const { data: session } = useSession();

  const isCreator = props.user.userId === session?.user.id;
  const [isEditing, setIsEditing] = useState(false);

  const createdAt = formatDistanceToNow(new Date(props.comment.createdAt), {
    addSuffix: true,
  });
  const updatedAt = formatDistanceToNow(new Date(props.comment.updatedAt), {
    addSuffix: true,
  });
  return (
    <div className={cn(props.className)}>
      <div className="flex gap-4">
        <AspectImage
          src={props.user.image}
          width={35}
          alt={`${props.user.username} profile image`}
        />
        <div className="flex-grow">
          <p className="mb-1 text-sm font-bold leading-tight">
            @{props.user.username}
          </p>
          <p className="nn-text-secondary text-xs">{createdAt}</p>
          {createdAt !== updatedAt && (
            <p className="nn-text-secondary text-xs">*Updated {updatedAt}</p>
          )}
        </div>
      </div>
      {isEditing ? (
        <CommentEdit
          refresh={() => {
            setIsEditing(false);
            props.refresh();
          }}
          deleteFn={() => null}
          comment={{ ...props.comment, userId: props.user.userId }}
          background={
            props.comment.parentId ? "nn-bg-background" : "nn-bg-foreground"
          }
          className="mb-4"
          defaultSubmitText="Update comment"
          actionText={["Updating", "Updated"]}
        />
      ) : (
        <p className="text-md my-4 whitespace-pre-wrap">
          {props.comment.content}
        </p>
      )}
      <div className="flex items-center">
        <span className="nn-text-secondary mx-2 text-center">
          {props.comment.voteTotal} point
          {props.comment.voteTotal !== 1 && "s"}
        </span>
        <CommentNavButton
          Icon={ArrowUpIcon}
          disabled={props.user.username === "deleted"}
          onClick={async () => {
            await upsertVote({
              userId: props.user.userId,
              resourceId: props.comment.id,
              value: 1,
              resourceType: "comment",
              revalidate: window.location.pathname,
            });

            props.refresh();
          }}
        />
        <CommentNavButton
          Icon={ArrowDownIcon}
          disabled={props.user.username === "deleted"}
          onClick={async () => {
            await upsertVote({
              userId: props.user.userId,
              resourceId: props.comment.id,
              value: -1,
              resourceType: "comment",
              revalidate: window.location.pathname,
            });

            props.refresh();
          }}
        />
        <CommentNavButton
          Icon={ExclamationTriangleIcon}
          disabled={props.user.username === "deleted"}
        />
        {isCreator && (
          <>
            {isEditing ? (
              <CommentNavButton
                Icon={Cross1Icon}
                onClick={() => setIsEditing(false)}
              />
            ) : (
              <CommentNavButton
                Icon={Pencil1Icon}
                onClick={() => setIsEditing(true)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
